#!/usr/bin/env node

var fs      = require('fs'),
    request = require('request');

var start;
var duration;
var running = 0,
    limit   = 200;
var urls = [];

var steps = [createlist, grayjs, createlist, grayc, createlist, grayb, createlist, gaussjs, createlist, gaussc, createlist, gaussb];
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
  for (var i = 1; i < 1338; i++) {
    var url = i + "";
    while (url.length < 5)
      url = "0" + url;
    urls.push(url);
  }
  callback();
}

function grayjs(callback){
  console.log('Executing gray native js code');
  execstep(graysinglejs, new Date(), function(){callback();});
}

function gaussjs(callback){
  console.log('Executing gauss native js code');
  execstep(gausssinglejs, new Date(), function(){callback();});
}

function grayc(callback){
  console.log('Executing gray wrapped c++ code');
  execstep(graysinglec, new Date(), function(){callback();});
}

function gaussc(callback){
  console.log('Executing gauss wrapped c++ code');
  execstep(gausssinglec, new Date(), function(){callback();});
}

function grayb(callback){
  console.log('Executing gray binded c++ code');
  execstep(graysingleb, new Date(), function(){callback();});
}

function gaussb(callback){
  console.log('Executing gauss binded c++ code');
  execstep(gausssingleb, new Date(), function(){callback();});
}

function execstep(func, start, callback){
  while(running < limit && urls.length > 0) {
    running++;
    var url = urls.shift();
    func(url, function(err) {
      if (err)
        throw err;
      running--;
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
    if (err) {
      console.log(url);
      throw err;
    }
    callback();
  });
}

function gausssinglejs(url, callback) {
  request.get('http://localhost:9001/gauss/' + url, function(err, resp, body) {
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

function gausssinglec(url, callback) {
  request.get('http://localhost:9002/gauss/' + url, function(err, resp, body) {
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

function gausssingleb(url, callback) {
  request.get('http://localhost:9003/gauss/' + url, function(err, resp, body) {
    if (err)
      throw err;
    callback();
  });
}
