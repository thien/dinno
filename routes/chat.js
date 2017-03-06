var express = require('express');
var app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var login = require('../functions/login');
app.locals.basedir = "." + '/views';

module.exports = function(){

  app.get('/chat', function (req, res) {
    login.checkLogin(req, res).then(function(result) {
      res.render('chat');
    }, function(err) {
      res.render('frontpage');
    });
  })

  return app;
}();
