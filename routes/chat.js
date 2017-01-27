var express = require('express');
var app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

module.exports = function(){
	app.locals.basedir = "." + '/views';

	app.get('/chat', function (req, res) {
	    res.render('chat2');
	})

	app.get('/chat2', function (req, res) {
	    res.render('chat');
	})

	return app;
}();