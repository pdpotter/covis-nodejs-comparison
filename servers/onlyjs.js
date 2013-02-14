#!/usr/bin/env node

/***
          Pure JavaScript server
***/

/***

  Various implementations exist for PNG de/encoding in Node.js:
  * node-pngjs (https://github.com/niegowski/node-pngjs)
  is the only Node.js package that provides both encoding and decoding using only Javascript.
  * png.js (https://github.com/devongovett/png.js) only does PNG decoding.
  * node-png  (https://github.com/pkrumins/node-png) uses the native library libpng.

  Various implementations exist for conversion to gray scale and the Gaussian blur filter.
  * Conversion to gray scale
    - This can be implemented very fast by calculating
      gray = 0.299 * red + 0.587 * green + 0.114 * blue
      for each pixel value.
    - However, the implementation in Jsfeat is faster by forcing integer operations.
  
  * Gaussian blur filter
    - The Kraken benchmark (http://krakenbenchmark.mozilla.org/explanations/gaussian-blur.html)
      This implementation is relatively slow compared to the others.
    - StackBlur (http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html)
      This is the fastest implementation, but is actually a mix between Gaussian blur and Box blur
    - A JavaScript implementation of
      Ian T. Young , Lucas J. van Vliet. Recursive implementation of the Gaussian filter.
      Signal processing, vol. 44, no. 1, pp. 139-151, 1995.
      as proposed by Martin (http://www.blogger.com/profile/02959903552471306591)
      in a reaction on a blogpost by Paul Nickerson
      (http://pvnick.blogspot.be/2010/01/im-currently-porting-image-segmentation.html)
    - Jsfeat has the fastest pure Gaussian blur implementation.
    
  Jsfeat is provided as a library and is even available as a package for node.js (jsfeat)
  
***/

var express = require('express'),
    cluster = require('cluster'),
    http = require('http'),
    PNG = require('pngjs').PNG,
    jsfeat = require('jsfeat');

var getGray,
    getGauss;

if (cluster.isMaster) {
  require('os').cpus().forEach(function() {
    cluster.fork();
  });
} else {

  /***    create server    ***/

  var app = exports.server = express(),
      port = process.env.PORT || 9001,
      host = process.env.HOST || '127.0.0.1';

  /***    configure server    ***/

  app.use(express.methodOverride());
  app.use(express.errorHandler());

  /***    start server    ***/

  app.listen(port);
  console.log('Pure JavaScript server running on http://' + host + ':' + port);

  /***    handlers    ***/

  getGray = function(req, res, next) {
    var img = req.params[0];
    // get png
    http.get('http://127.0.0.1:9000/' + img + '.png', function(serverres) {
      serverres.pipe(new PNG({deflateLevel: 1, filterType: [0,1]}))
               .on('parsed',function(){
                  // convert to gray scale
                  var i,j;
                  var dst = new Buffer(this.data.length/4);
                  jsfeat.imgproc.grayscale(this.data, dst);
                  for (i = j = 0; i < dst.length; i++, j += 4) {
                    this.data[j] = this.data[j + 1] = this.data[j + 2] = dst[i];
                  }
                  // send result
                  res.header('Content-Type', 'image/png');
                  this.pack()
                      .pipe(res);
                  // manual garbage collection if requested
                  if (process.argv[2] === "gc") {
                    global.gc();
                  }
                });
    });
  };

  getGauss = function(req, res, next) {
    var img = req.params[0];
    // get png
    http.get('http://127.0.0.1:9000/' + img + '.png', function(serverres) {
      serverres.pipe(new PNG({deflateLevel: 1, filterType: [0,1]}))
               .on('parsed',function(){
                  // Gaussian blur filter
                  var i,j;
                  var red = new jsfeat.matrix_t(this.width, this.height, jsfeat.U8_t | jsfeat.C1_t);
                  var green = new jsfeat.matrix_t(this.width, this.height, jsfeat.U8_t | jsfeat.C1_t);
                  var blue = new jsfeat.matrix_t(this.width, this.height, jsfeat.U8_t | jsfeat.C1_t);
                  for (i = j = 0; i < this.data.length; i += 4, j++) {
                    red.data[j]   = this.data[i];
                    green.data[j] = this.data[i + 1];
                    blue.data[j]  = this.data[i + 2];
                  }
                  var gred = new jsfeat.matrix_t(this.width, this.height, jsfeat.U8_t | jsfeat.C1_t);
                  var ggreen = new jsfeat.matrix_t(this.width, this.height, jsfeat.U8_t | jsfeat.C1_t);
                  var gblue = new jsfeat.matrix_t(this.width, this.height, jsfeat.U8_t | jsfeat.C1_t);
                  jsfeat.imgproc.gaussian_blur(red, gred, 7);
                  jsfeat.imgproc.gaussian_blur(green, ggreen, 7);
                  jsfeat.imgproc.gaussian_blur(blue, gblue, 7);
                  for (i = j = 0; i < this.data.length; i += 4, j++) {
                    this.data[i]     = gred.data[j];
                    this.data[i + 1] = ggreen.data[j];
                    this.data[i + 2] = gblue.data[j];
                  }
                  // send result
                  res.header('Content-Type', 'image/png');
                  this.pack()
                      .pipe(res);
                  // manual garbage collection if requested
                  if (process.argv[2] === "gc") {
                    global.gc();
                  }
                });
                 
    });
  };
  
  /***    routing    ***/

  app.get(/^\/grays\/(\d+)$/, getGray);
  app.get(/^\/gauss\/(\d+)$/, getGauss);
}
