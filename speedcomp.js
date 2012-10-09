#!/usr/bin/env node

var fs   = require('fs'),
    exec = require('child_process').exec;
    cv   = require('./node-opencv/lib/opencv');
    argv = require('optimist').usage('Usage: $0 -i inputfolder -oc coutputfolder -oj joutputfolder')
                              .demand(['i','oc','oj'])
                              .argv;

var start;
var duration;
var inputfiles;
var outputfiles;
var running = 0,
    limit   = 200;

var steps = [initc,removecoutput,initjs,removejsoutput,initc,removecoutput,initjs,removejsoutput];
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

function initc(callback){
  console.log('Executing c code externally');
  execstep(singlec, argv.i, argv.oc, fs.readdirSync(argv.i), new Date(), function(){callback();});
}

function initjs(callback){
  console.log('Executing wrapped code');
  execstep(singlejs, argv.i, argv.oj, fs.readdirSync(argv.i), new Date(), function(){callback();});
}

function removecoutput(callback){
  emptydir(argv.oc, fs.readdirSync(argv.oc), function(){callback();});
}

function removejsoutput(callback){
  emptydir(argv.oj, fs.readdirSync(argv.oj), function(){callback();});
}

function execstep(func, pathin, pathout, files, start, callback){
  while(running < limit && files.length > 0) {
    running++;
    console.log(running);
    var file = files.shift();
    func(pathin, pathout, file, function(err) {
      if (err)
        throw err;
      running--;
      if(files.length > 0) {
        execstep(func, pathin, pathout, files, start, callback);
      }
      else if(running == 0){
        duration = new Date() - start;
        console.log('Executed in: ' + duration + 'ms');
        callback();
      }
    });
  }
}

function singlec(pathin, pathout, file, callback) {
  exec('./Gray -i ' + pathin + '/' + file + ' -o ' + pathout + '/' + file, function(err, stdout, stderr){
    if (err)
      throw err;
    callback();
  });
}

function singlejs(pathin, pathout, file, callback) {
  cv.readImage(pathin + '/' + file, function(err, im){
    if (err)
      throw err;
    //im.convertGrayscale();
    //im.save(pathout + '/' + file);
    callback();
  });
}

function emptydir(path, files, callback) {
  while(running < limit && files.length > 0) {
    var file = files.shift();
    fs.unlink(path + '/' + file, function (err) {
      if (err)
        throw err;
      running--;
      if(files.length > 0) {
        emptydir(path, files, callback);
      }
      else if(running == 0){
        callback();
      }
    });
    running++;
  }
}
