#!/usr/bin/env node

var fs      = require('fs'),
    request = require('request');

var start;
var duration;
var longest = 0;
var running = 0,
    limit   = 200;
var urls = [];

var steps = [commandsplease];
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

function graypj(callback){
  console.log('Executing gray pure javascript code');
  execstep(graysinglepj, function(){callback();});
}

function gausspj(callback){
  console.log('Executing gauss pure javascript code');
  execstep(gausssinglepj, function(){callback();});
}

function grayepc(callback){
  console.log('Executing gray external program call code');
  execstep(graysingleepc, function(){callback();});
}

function gaussepc(callback){
  console.log('Executing gauss external program call code');
  execstep(gausssingleepc, function(){callback();});
}

function graynao(callback){
  console.log('Executing gray native add-on code');
  execstep(graysinglenao, function(){callback();});
}

function gaussnao(callback){
  console.log('Executing gauss native add-on code');
  execstep(gausssinglenao, function(){callback();});
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

function graysinglepj(url, startpart, callback) {
  request.get('http://localhost:9001/grays/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}

function gausssinglepj(url, startpart, callback) {
  request.get('http://localhost:9001/gauss/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}

function graysingleepc(url, startpart, callback) {
  request.get('http://localhost:9002/grays/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}

function gausssingleepc(url, startpart, callback) {
  request.get('http://localhost:9002/gauss/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}

function graysinglenao(url, startpart, callback) {
  request.get('http://localhost:9003/grays/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}

function gausssinglenao(url, startpart, callback) {
  request.get('http://localhost:9003/gauss/' + url, function(err, resp, body) {
    if (err)
      throw err;
    duration = new Date() - startpart;
    console.log('Executed in: ' + duration);
    callback();
  });
}
