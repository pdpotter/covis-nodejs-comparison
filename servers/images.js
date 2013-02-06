#!/usr/bin/env node

/***
          Images server
***/

var express = require('express');

/***    create server    ***/

var app = exports.server = express(),
    port = process.env.PORT || 9000,
    host = process.env.HOST || '127.0.0.1';

/***    configure server    ***/

app.use(express.methodOverride());
app.use(express.errorHandler());
app.use("/",express.static("../images"));

/***    start server    ***/

app.listen(port);
console.log('Images server running on http://' + host + ':' + port);
