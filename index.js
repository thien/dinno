// load depdendencies
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const fs = require('fs');
const pug = require('pug');
const database = require('mysql');

// initiate express and database
const app = express();
const server = require('http').Server(app);

//set up socket
const io = require('socket.io')(server);
// load socket files from functions directory
require('./functions/socket')(io, server);

// deal with port
const port = process.env.PORT || 8080;

//database key
// var db = require('./functions/database');

//Configure express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// make sure bower compoments are directed right.
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use("/data", express.static(__dirname + '/data'));

// manage views
app.set('views', __dirname + '/views')
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')
app.locals.basedir = __dirname + '/views';

// search item
app.use('/', require('./routes/search'));  

// chat
app.use('/', require('./routes/chat'));  

// front page
app.use('/', require('./routes/frontpage'));  

// login page
app.use('/', require('./routes/login'));  

// register page
app.use('/', require('./routes/register'));  

// profile page
app.use('/', require('./routes/profile'));  

// food item
app.use('/', require('./routes/fooditem'));  

// add food item
app.use('/', require('./routes/add'));  

// add static assets for public access
app.use('/assets', express.static('./views/assets'))

// add error message - THIS MUST BE THE LAST ROUTE TO BE DEFINED
app.use('/', require('./routes/error'));  

server.listen(port, function () {
    // notify user that server is running
    console.log("Dinno can be seen on http://localhost:"  + port);
});
