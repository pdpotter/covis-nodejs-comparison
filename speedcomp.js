#!/usr/bin/env node

var fs      = require('fs'),
    request = require('request');

var start;
var duration;
var running = 0,
    limit   = 200;
var urls = [];

var steps = [createlist, grayb];
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

function createlist(callback){
  console.log('Creating url list');
  for (var i = 0; i < 1334; i++) {
    var url = i + "";
    while (url.length < 5)
      url = "0" + url;
    urls.push(url);
  }
  callback();
}

function grayjs(callback){
  console.log('Executing native js code (pngjs)');
  execstep(graysinglejs, new Date(), function(){callback();});
}

function grayc(callback){
  console.log('Executing wrapped c++ code');
  execstep(graysinglec, new Date(), function(){callback();});
}

function grayb(callback){
  console.log('Executing binded c++ code');
  execstep(graysingleb, new Date(), function(){callback();});
}

function execstep(func, start, callback){
  while(running < limit && urls.length > 0) {
    running++;
    //console.log(running);
    var url = urls.shift();
    func(url, function(err) {
      if (err)
        throw err;
      running--;
      //console.log(running);
      if(urls.length > 0) {
        execstep(func, start, callback);
      }
      else if(running == 0){
        duration = new Date() - start;
        console.log('Executed in: ' + duration + 'ms');
        callback();
      }
    });
  }
}

function graysinglejs(url, callback) {
  request.get('http://localhost:9001/grays/' + url, function(err, resp, body) {
    if (err)
      throw err;
    callback();
  });
}

function graysinglec(url, callback) {
  request.get('http://localhost:9002/grays/' + url, function(err, resp, body) {
    if (err)
      throw err;
    callback();
  });
}

function graysingleb(url, callback) {
  request.get('http://localhost:9003/grays/' + url, function(err, resp, body) {
    if (err)
      throw err;
    callback();
  });
}
