var express  = require('express');
var app      = express();
const server = require('http').Server(app);
const io     = require('socket.io')(server);
var login    = require('../functions/login');
var chat     = require('../functions/chat');
var Cookies  = require("cookies");
app.locals.basedir = "." + '/views';


module.exports = function(){

  app.get('/chat', function (req, res) {
    login.checkLogin(req, res).then(function(result) {
      var cookies = new Cookies(req, res);
      var senderId = cookies.get('id');
      var recipientId = req.query.id;
      if (senderId && recipientId) {

        chat.getRecipientName(recipientId).then(function(name) {
          var param = {
                theirName: name,
            };
          res.render('chat', param);
        }, function(err) {
          res.render('frontpage');
        });
        
      }
      else {
        res.render('frontpage');
      }
    }, function(err) {
      res.render('frontpage');
    });
  })

  return app;
}();
