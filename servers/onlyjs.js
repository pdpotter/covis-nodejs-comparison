#!/usr/bin/env node

/***
          Pure JavaScript server
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

  /***    helper functions    ***/

 

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
                  var i,j;
                  var dst = new Buffer(this.data.length/4);
                  jsfeat.imgproc.grayscale(this.data, dst);
                  for (i = j = 0; i < dst.length; i++, j += 4) {
                    this.data[j] = this.data[j + 1] = this.data[j + 2] = dst[i];
                  }
                  // write png
                  res.header('Content-Type', 'image/png');
                  this.pack()
                      .pipe(res);
                });
    });
  };

  getGauss = function(req, res, next) {
    var img = req.params[0];
    // get png
    http.get('http://127.0.0.1:9000/' + img + '.png', function(serverres) {
      serverres.pipe(new PNG({deflateLevel: 1, filterType: [0,1]}))
               .on('parsed',function(){
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
                  // write png
                  res.header('Content-Type', 'image/png');
                  this.pack()
                      .pipe(res);
                });
                 
    });
  };
  
  /***    routing    ***/

  app.get(/^\/grays\/(\d+)$/, getGray);
  app.get(/^\/gauss\/(\d+)$/, getGauss);
}
