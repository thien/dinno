module.exports = function(){
	var express = require('express');
	var app = express();
	app.locals.basedir = "." + '/views';

	app.get('/', function (req, res) {
	    var user = req.query.user;
	    var pass = req.query.pass;
	    res.render('frontpage');
	})

	return app;
}();