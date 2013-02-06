#!/usr/bin/env node

/***
          External program call server
***/

var express = require('express'),
    cluster = require('cluster'),
    http = require('http'),
    fs = require('fs'),
    exec = require('child_process').exec,
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
      port = process.env.PORT || 9002,
      host = process.env.HOST || '127.0.0.1';

  /***    configure server    ***/

  app.use(express.methodOverride());
  app.use(express.errorHandler());

  /***    start server    ***/

  app.listen(port);
  console.log('External program call server running on http://' + host + ':' + port);

  /***    handlers    ***/

  getGray = function(req, res, next) {
    var img = req.params[0];
    var filename = '../tmp/' + img + '.png';
    var resultname = '../tmp/' + 'grays_' + img + '.png';
    var writestream = fs.createWriteStream(filename);
    http.get('http://127.0.0.1:9000/' + img + '.png', function(serverres) {
      serverres.pipe(writestream);
      serverres.on('end', function(){
                 exec('../alg/Gray/Gray -i ' + filename + ' -o ' + resultname, function(err, stdout, stderr){
                   if (err) throw err;
                   fs.readFile(resultname, function (err, data) {
                     if (err) throw err;
                     res.header('Content-Type', 'image/png');
                     res.send(data);
                     fs.unlink(filename);
                     fs.unlink(resultname);
                   });
                 });
               });
    });
  };
  
  getGauss = function(req, res, next) {
    var img = images.get(req.params[0]);
    if (img) {
      var resultname = '../tmp/' + 'grays_' + img.id + '.' + img.extension;
      exec('../alg/Gaussian/Gaussian -i ' + img.fileName + ' -o ' + resultname, function(err, stdout, stderr){
        if (err) throw err;
        serverutils.respond.withFile(res, resultname, images.exts_getconttype(img.extension), null, function(err){
          fs.unlink(resultname);
        });
      });
    }
    else {
      res.header('Link','</gauss>; rel="index"');
      res.send('', 404);
    }
  };
  
  /***    routing    ***/

  app.get(/^\/grays\/(\d+)$/, getGray);
  app.get(/^\/gauss\/(\d+)$/, getGauss);
}
