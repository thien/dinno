var express  = require('express');
var app      = express();
const server = require('http').Server(app);
const io     = require('socket.io')(server);
var login    = require('../functions/login');
var Cookies  = require("cookies");
app.locals.basedir = "." + '/views';

module.exports = function(){

  app.get('/chat', function (req, res) {
    login.checkLogin(req, res).then(function(result) {
      var cookies = new Cookies(req, res);
      var myId = cookies.get('id');
      var theirId = req.query.id;
      console.log(myId);
      console.log(theirId);
      res.render('chat');
    }, function(err) {
      res.render('frontpage');
    });
  })

  return app;
}();
