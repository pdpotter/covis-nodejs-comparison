#!/usr/bin/env node

/***
          Pure JavaScript server
***/

var express = require('express'),
    cluster = require('cluster'),
    http = require('http'),
    PNG = require('pngjs').PNG;

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
                  ptr = 0;
                  // convert to greyscale
                  for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                      var ptr = (this.width * y + x) << 2;
                      var grayval = 0.299 * this.data[ptr] + 0.587 * this.data[ptr + 1] + 0.114 * this.data[ptr + 2];
                      this.data[ptr] = grayval;
                      this.data[ptr + 1] = grayval;
                      this.data[ptr + 2] = grayval;
                    }
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
                 // apply gaussian filter
                 var width = this.width;
                 var width4 = width << 2;
                 var height = this.height;
                 
                 // compute coefficients as a function of sigma = 1.3
                 var q = 3.97156 - 4.14554 * Math.sqrt(1.0 - 0.26891 * 1.3);
                 
                 //compute b0, b1, b2, and b3
                 var qq = q * q;
                 var qqq = qq * q;
                 var b0 = 1.57825 + (2.44413 * q) + (1.4281 * qq ) + (0.422205 * qqq);
                 var b1 = ((2.44413 * q) + (2.85619 * qq) + (1.26661 * qqq)) / b0;
                 var b2 = (-((1.4281 * qq) + (1.26661 * qqq))) / b0;
                 var b3 = (0.422205 * qqq) / b0;
                 var bigB = 1.0 - (b1 + b2 + b3);
                 
                 // horizontal
                 for (var c = 0; c < 3; c++) {
                   for (var y = 0; y < height; y++) {
                     // forward 
                     var index = y * width4 + c;
                     var indexLast = y * width4 + 4 * (width - 1) + c;
                     var pixel = this.data[index];
                     var ppixel = pixel;
                     var pppixel = ppixel;
                     var ppppixel = pppixel;
                     for (; index <= indexLast; index += 4) {
                       pixel = bigB * this.data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                       this.data[index] = pixel; 
                       ppppixel = pppixel;
                       pppixel = ppixel;
                       ppixel = pixel;
                    }
                    // backward
                    index = y * width4 + 4 * (width - 1) + c;
                    indexLast = y * width4 + c;
                    pixel = this.data[index];
                    ppixel = pixel;
                    pppixel = ppixel;
                    ppppixel = pppixel;
                    for (; index >= indexLast; index -= 4) {
                      pixel = bigB * this.data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                      this.data[index] = pixel;
                      ppppixel = pppixel;
                      pppixel = ppixel;
                      ppixel = pixel;
                    }
                  }
                }
                
                // vertical
                for (var c = 0; c < 3; c++) {
                  for (var x = 0; x < width; x++) {
                    // forward 
                    var index = 4 * x + c;
                    var indexLast = (height - 1) * width4 + 4 * x + c;
                    var pixel = this.data[index];
                    var ppixel = pixel;
                    var pppixel = ppixel;
                    var ppppixel = pppixel;
                    for (; index <= indexLast; index += width4) {
                      pixel = bigB * this.data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                      this.data[index] = pixel;
                      ppppixel = pppixel;
                      pppixel = ppixel;
                      ppixel = pixel;
                    } 
                    // backward
                    index = (height - 1) * width4 + 4 * x + c;
                    indexLast = 4 * x + c;
                    pixel = this.data[index];
                    ppixel = pixel;
                    pppixel = ppixel;
                    ppppixel = pppixel;
                    for (; index >= indexLast; index -= width4) {
                      pixel = bigB * this.data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                      this.data[index] = pixel;
                      ppppixel = pppixel;
                      pppixel = ppixel;
                      ppixel = pixel;
                    }
                  }
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
