#!/usr/bin/env node

/***
          Pure JavaScript server
***/

var express = require('express'),
    cluster = require('cluster'),
    http = require('http'),
    PNG = require('pngjs').PNG;
    
var sigma = 10,
    kernel,
    kernelSize,
    kernelSum;
    
var getGray,
    getGauss,
    buildKernel;

if (cluster.isMaster) {
  require('os').cpus().forEach(function() {
    cluster.fork();
  });
} else {

  /***    helper functions    ***/

  buildKernel = function() {
    var ss = sigma * sigma;
    var factor = 2 * Math.PI * ss;
    kernel = [];
    kernel.push([]);
    var i = 0, j, g;
    do {
      g = Math.exp(-(i * i) / (2 * ss)) / factor;
      if (g < 1e-3) break;
      kernel[0].push(g);
      ++i;
    } while (i < 3);
    kernelSize = i;
    for (j = 1; j < kernelSize; ++j) {
      kernel.push([]);
      for (i = 0; i < kernelSize; ++i) {
        g = Math.exp(-(i * i + j * j) / (2 * ss)) / factor;
        kernel[j].push(g);
      }
    }
    kernelSum = 0;
    for (j = 1 - kernelSize; j < kernelSize; ++j) {
      for (i = 1 - kernelSize; i < kernelSize; ++i) {
        kernelSum += kernel[Math.abs(j)][Math.abs(i)];
      }
    }
  };

  /***    create server    ***/

  var app = exports.server = express(),
      port = process.env.PORT || 9001,
      host = process.env.HOST || '127.0.0.1';

  /***    configure server    ***/

  app.use(express.methodOverride());
  app.use(express.errorHandler());
  
  /***    build gaussian kernel ***/
  
  buildKernel();

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
                 ptr = 0;
                 // apply gaussian filter
                 var origData = new Buffer(this.data.length);
                 this.data.copy(origData);
                 var ptr;
                 for (var y = 0; y < this.height; y++) {
                   for (var x = 0; x < this.width; x++) {
                     var r = 0, g = 0, b = 0, a = 0;
                     for (j = 1 - kernelSize; j < kernelSize; ++j) {
                       if (y + j < 0 || y + j >= this.height) continue;
                       for (i = 1 - kernelSize; i < kernelSize; ++i) {
                         if (x + i < 0 || x + i >= this.width) continue;
                         ptr = (this.width * (y + j) + (x + i)) << 2;
                         r += origData[ptr] * kernel[Math.abs(j)][Math.abs(i)];
                         g += origData[ptr + 1] * kernel[Math.abs(j)][Math.abs(i)];
                         b += origData[ptr + 2] * kernel[Math.abs(j)][Math.abs(i)];
                         a += origData[ptr + 3] * kernel[Math.abs(j)][Math.abs(i)];
                       }
                     }
                     ptr = (this.width * y + x) << 2;
                     this.data[ptr] = r / kernelSum;
                     this.data[ptr + 1] = g / kernelSum;
                     this.data[ptr + 2] = b / kernelSum;
                     this.data[ptr + 3] = a / kernelSum;
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
