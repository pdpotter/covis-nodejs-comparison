#!/usr/bin/env node

/***
          Filter server
***/

var express = require('express'),
    cluster = require('cluster'),
    fs = require('fs'),
    PNG = require('pngjs').PNG,
    images = require('../common/descr/image-library.js').Images;

if (cluster.isMaster) {
  require('os').cpus().forEach(function() {
    cluster.fork();
  });
} else {

  /***    create server    ***/

  var app = exports.server = express(),
      port = process.env.PORT || 9001,
      host = process.env.PORT || '127.0.0.1';

  /***    configure server    ***/

  app.use(express.methodOverride());
  app.use(express.errorHandler());

  /***    start server    ***/

  app.listen(port);
  console.log('onlyjs server running on http://' + host + ':' + port);

  /***    routing    ***/

  app.get(/^\/grays\/(\d+)$/, getGray);

  /***    handlers    ***/

  function getGray(req, res, next) {
    var img = images.get(req.params[0]);
    if (img) {
      // read png
      fs.createReadStream(img.fileName)
        .pipe(new PNG({deflateLevel: 1, filterType: [0,1]}))
        .on('parsed',function(){
          ptr = 0;
          for (var x = 0; x < this.height; x++) {
            for (var y = 0; y < this.width; y++) {
              var ptr = (this.width * x + y) << 2;
              // convert to greyscale
              var grayval = 0.299 * this.data[ptr] + 0.587 * this.data[ptr + 1] + 0.114 * this.data[ptr + 2];
              this.data[ptr] = grayval;
              this.data[ptr + 1] = grayval;
              this.data[ptr + 2] = grayval;
            }
          }
          res.header('Content-Type', images.exts_getconttype(img.extension));
          // write png
          this.pack()
              .pipe(res)
        });
    }
    else {
      res.header('Link','</grays>; rel="index"');
      res.send('', 404);
    }
  }
}
