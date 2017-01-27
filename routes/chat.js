module.exports = function(){
	var express = require('express');
	var app = express();
	app.locals.basedir = "." + '/views';

	app.get('/chat', function (req, res) {
	    res.render('chat2');
	})

	app.get('/chat2', function (req, res) {
	    res.render('chat');
	})

	return app;
}();