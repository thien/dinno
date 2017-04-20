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

//set up sockets
const io = require('socket.io')(server);
// load socket file from functions directory
require('./functions/socket')(io, server);

// deal with port
const port = process.env.PORT || 8080;

//database key
// var db = require('./functions/database');

//Configure express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// manage views
app.set('views', __dirname + '/views')
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')
app.locals.basedir = __dirname + '/views';

// make sure bower compoments are directed right.
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use("/data", express.static(__dirname + '/data'));

// deal with https redirect
app.get('*',function(req,res,next){
  if(port != 8080 && req.headers['x-forwarded-proto']!='https')
    res.redirect('https://'+req.headers.host+req.url);
  else
    next();
})

require('./routes/api')(app,express,io); 

server.listen(port, function () {
    // notify user that server is running
    console.log("Dinno can be seen on http://localhost:"  + port);
});
