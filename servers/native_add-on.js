#!/usr/bin/env node

/***
          Native add-on server
***/

/***

  Two existing project provide Node.js bindings for OpenCV:
  https://github.com/peterbraden/node-opencv and https://github.com/codeboost/opencv-node
  
  
  https://github.com/codeboost/opencv-node is used since it uses a semi-automatic approach,
  using https://github.com/codeboost/bea, to expose C++ libraries to Javascript.
  This makes it a lot easier to add additional functions to expose
  and to maintain the native add-on in case of changes in the library.

***/

var express = require('express'),
    cluster = require('cluster'),
    http = require('http'),
    // this is a slightly adapted version of opencv-node
    // implementing imencode and imdecode using Node::Buffer
    // te adapted version can be found on
    // https://github.com/pdpotter/opencv-node/tree/using_buffer
    cv = require('../../opencv-node');

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
      host = process.env.HOST || '127.0.0.1';

  /***    configure server    ***/

  app.use(express.methodOverride());
  app.use(express.errorHandler());

  /***    start server    ***/

  app.listen(port);
  console.log('Native add-on server running on http://' + host + ':' + port);

  /***    handlers    ***/

  getGray = function(req, res, next) {
    var img = req.params[0];
    // get png
    http.get('http://127.0.0.1:9000/' + img + '.png', function(serverres) {
      var rawdata = new Buffer(Number(serverres.headers['content-length']));
      var offset = 0;
      serverres.on('data',function(chunk){
        chunk.copy(rawdata, offset);
        offset = offset + chunk.length;
      });
      serverres.on('end', function(){
        // convert to gray scale
        var src = new cv.Mat(cv.imdecode(rawdata,1));
        var gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.CV_BGR2GRAY);
        var buf = cv.imencode('.png', gray);
        // send result
        res.header('Content-Type', 'image/png');
        res.send(buf);
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
      var rawdata = new Buffer(Number(serverres.headers['content-length']));
      var offset = 0;
      serverres.on('data',function(chunk){
        chunk.copy(rawdata, offset);
        offset = offset + chunk.length;
      });
      serverres.on('end', function(){
        // gaussian blur filter
        var src = new cv.Mat(cv.imdecode(rawdata,1));
        var gauss = new cv.Mat(src.size, src.type);
        cv.GaussianBlur(src, gauss, {width: 7, height: 7}, 0);
        var buf = cv.imencode('.png', gauss);
        // send result
        res.header('Content-Type', 'image/png');
        res.send(buf);
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
