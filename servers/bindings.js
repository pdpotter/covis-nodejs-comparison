#!/usr/bin/env node

/***
          Filter server
***/

//require('nodetime').profile();

var express = require('express'),
    cluster = require('cluster'),
    fs = require('fs'),
    cv = require('../../opencv-node'),
    serverutils = require('../common/descr/server-util.js'),
    images = require('../common/descr/image-library.js').Images;

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

  /***    routing    ***/

  app.get(/^\/grays\/(\d+)$/, getGray);

  /***    handlers    ***/

  function getGray(req, res, next) {
    var img = images.get(req.params[0]);
    if (img) {
      var resultname = '../tmp/' + 'grays_' + img.id + '.' + img.extension;
      // read png
      var src = cv.imread(img.fileName);
      var gray = new cv.Mat;
      cv.cvtColor(src, gray, cv.CV_BGR2GRAY);
      //var buf = new Buffer(cv.imencode('.png', gray),'binary');
      var buf = cv.imencode('.png', gray);
      res.header('Content-Type', images.exts_getconttype(img.extension));
      res.send(buf);
      //cv.imwrite(resultname, gray);
      //serverutils.respond.withFile(res, resultname, images.exts_getconttype(img.extension), null, function(err){
      //  fs.unlink(resultname);
      //});
    }
    else {
      res.header('Link','</grays>; rel="index"');
      res.send('', 404);
    }
  }
}
