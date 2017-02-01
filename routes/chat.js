var express = require('express');
var app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.locals.basedir = "." + '/views';

module.exports = function(){

	app.get('/chat', function (req, res) {
	    res.render('chat');
	})

	return app;
}();
