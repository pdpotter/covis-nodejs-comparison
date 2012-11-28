#!/usr/bin/env node

var fs      = require('fs'),
    request = require('request'),
    argv    = require('optimist').usage('Usage: $0 -i inputfolder')
                              .demand(['i'])
                              .argv;

var start;
var duration;
var inputfiles;
var outputfiles;
var running = 0,
    limit   = 200;
var urls = [];

var steps = [uploadc, grayc, emptyurls, uploadjs, grayjs, emptyurls, uploadc, grayc, emptyurls, uploadjs, grayjs, emptyurls];
//var steps = [uploadjs, grayjs, emptyurls];
executeSteps();

function executeSteps() {
  var step = steps.shift();
  if (!step)
    return;
  step(function(err){
    if (err)
      throw err;
    executeSteps();
  });
}

function uploadc(callback){
  console.log('Uploading for wrapped c++ code');
  execstep(uploadsinglec, argv.i, fs.readdirSync(argv.i), new Date(), function(){callback();});
}

function grayc(callback){
  console.log('Executing wrapped c++ code');
  execstep(graysinglec, argv.i, fs.readdirSync(argv.i), new Date(), function(){callback();});
}

function emptyurls(callback){
  console.log('Clearing url list');
  urls.length = 0;
  callback();
}

function uploadjs(callback){
  console.log('Uploading for native js code (pngjs)');
  execstep(uploadsinglejs, argv.i, fs.readdirSync(argv.i), new Date(), function(){callback();});
}

function grayjs(callback){
  console.log('Executing native js code (pngjs)');
  execstep(graysinglejs, argv.i, fs.readdirSync(argv.i), new Date(), function(){callback();});
}

function execstep(func, pathin, files, start, callback){
  while(running < limit && files.length > 0) {
    running++;
    //console.log(running);
    var file = files.shift();
    func(pathin, file, function(err) {
      if (err)
        throw err;
      running--;
      //console.log(running);
      if(files.length > 0) {
        execstep(func, pathin, files, start, callback);
      }
      else if(running == 0){
        duration = new Date() - start;
        console.log('Executed in: ' + duration + 'ms');
        callback();
      }
    });
  }
}

function uploadsinglec(pathin, file, callback) {
  var r = request.post({url:'http://localhost:8802/images', headers:''}, function(err, resp, body) {
    if (err)
      throw err;
    urls.push(resp.headers.location);
    callback();
  });
  var form = r.form();
  form.append('image', fs.ReadStream(pathin + '/' + file));
}

function graysinglec(pathin, file, callback) {
  var index = file.split('.')[0];
  request.get('http://localhost:8802/grays/' + urls[index].split('/')[2], function(err, resp, body) {
    if (err)
      throw err;
    callback();
  });
}

function uploadsinglejs(pathin, file, callback) {
  var r = request.post({url:'http://localhost:8812/images', headers:''}, function(err, resp, body) {
    if (err)
      throw err;
    urls.push(resp.headers.location);
    callback();
  });
  var form = r.form();
  form.append('image', fs.ReadStream(pathin + '/' + file));
}

function graysinglejs(pathin, file, callback) {
  var index = file.split('.')[0];
  request.get('http://localhost:8812/grays/' + urls[index].split('/')[2], function(err, resp, body) {
    if (err)
      throw err;
    callback();
  });
}
