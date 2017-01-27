module.exports = function(){
	var express = require('express');
	var app = express();
	app.locals.basedir = "." + '/views';

	app.get('/register', function (req, res) {
	    res.render('register');
	})

	app.post('/register', function (req, res) {
    // get results
    // console.log(req.body);
	    var checks = req.body;
	    res.render('register', checks);
	})

	return app;
}();