#!/usr/bin/env node

var fs      = require('fs'),
    request = require('request');

var start;
var duration;
var longest = 0;
var running = 0,
    limit   = 1;
var urls = [];

//var steps = [createlist, grayjs, createlist, grayc, createlist, grayb, createlist, gaussjs, createlist, gaussc, createlist, gaussb];
var steps = [createlist, grayc];
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
  for (var c =1; c<= 10; c++) {
    for (var i = 1; i <= 1338; i++) {
      var url = i + "";
      while (url.length < 5)
        url = "0" + url;
      urls.push(url);
    }
  }
  callback();
}

function grayjs(callback){
  console.log('Executing gray native js code');
  execstep(graysinglejs, function(){callback();});
}

function gaussjs(callback){
  console.log('Executing gauss native js code');
  execstep(gausssinglejs, function(){callback();});
}

function grayc(callback){
  console.log('Executing gray wrapped c++ code');
  execstep(graysinglec, function(){callback();});
}

function gaussc(callback){
  console.log('Executing gauss wrapped c++ code');
  execstep(gausssinglec, function(){callback();});
}

function grayb(callback){
  console.log('Executing gray binded c++ code');
  execstep(graysingleb, function(){callback();});
}

function gaussb(callback){
  console.log('Executing gauss binded c++ code');
  execstep(gausssingleb, function(){callback();});
}

function execstep(func, callback){
  while(running < limit && urls.length > 0) {
    running++;
    var url = urls.shift();
    func(url, new Date(), function(err) {
      if (err)
        throw err;
      running--;
      if(urls.length > 0) {
        execstep(func, callback);
      }
      else if(running == 0){
        callback();
      }
    });
  }
}

function graysinglejs(url, startpart, callback) {
  request.get('http://localhost:9001/grays/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}

function gausssinglejs(url, startpart, callback) {
  request.get('http://localhost:9001/gauss/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}

function graysinglec(url, startpart, callback) {
  request.get('http://localhost:9002/grays/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}

function gausssinglec(url, startpart, callback) {
  request.get('http://localhost:9002/gauss/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}

function graysingleb(url, startpart, callback) {
  request.get('http://localhost:9003/grays/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}

function gausssingleb(url, startpart, callback) {
  request.get('http://localhost:9003/gauss/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}
