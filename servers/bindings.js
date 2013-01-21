#!/usr/bin/env node

/***
          Filter server
***/

var express = require('express'),
    cluster = require('cluster'),
    fs = require('fs'),
    cv = require('../../opencv-node'),
    serverutils = require('../common/descr/server-util.js'),
    images = require('../common/descr/image-library.js').Images;

var getGray,
    getGauss;

if (cluster.isMaster) {
  require('os').cpus().forEach(function() {
    cluster.fork();
  });
} else {

  /***    create server    ***/

  var app = exports.server = express(),
      port = process.env.PORT || 9003,
      host = process.env.PORT || '127.0.0.1';

  /***    configure server    ***/

  app.use(express.methodOverride());
  app.use(express.errorHandler());

  /***    start server    ***/

  app.listen(port);
  console.log('onlyjs server running on http://' + host + ':' + port);

  /***    handlers    ***/

  getGray = function(req, res, next) {
    var img = images.get(req.params[0]);
    if (img) {
      // read png
      var src = cv.imread(img.fileName);
      var gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.CV_BGR2GRAY);
      var buf = cv.imencode('.png', gray);
      res.header('Content-Type', images.exts_getconttype(img.extension));
      res.send(buf);
    }
    else {
      res.header('Link','</grays>; rel="index"');
      res.send('', 404);
    }
  };
  
  getGauss = function(req, res, next) {
    var img = images.get(req.params[0]);
    if (img) {
      // read png
      var src = cv.imread(img.fileName);
      var gauss = new cv.Mat(src.size, src.type);
      cv.GaussianBlur(src, gauss, {width: 7, height: 7}, 0);
      var buf = cv.imencode('.png', gauss);
      res.header('Content-Type', images.exts_getconttype(img.extension));
      res.send(buf);
    }
    else {
      res.header('Link','</grays>; rel="index"');
      res.send('', 404);
    }
  };

  /***    routing    ***/

  app.get(/^\/grays\/(\d+)$/, getGray);
  app.get(/^\/gauss\/(\d+)$/, getGauss);
}
