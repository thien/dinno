module.exports = function(){
	var express = require('express');
	var app = express();
	app.locals.basedir = "." + '/views';

	app.get('/login', function (req, res) {
	    res.render('login');
	})

	app.post('/login', function (req, res) {
	    var user = req.body.user;
	    var pass = req.body.pass;
	    var param = {
	        username: user,
	        password: pass
	    }
	    // console.log(req.body)
	    // console.log(param)
	    res.render('login', param);
	})

	return app;
}();