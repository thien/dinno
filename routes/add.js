module.exports = function(){
	var express = require('express');
	var app = express();
	app.locals.basedir = "." + '/views';

	app.get('/add', function (req, res) {
	    res.render('new_fooditem');
	})

	app.post('/add', function (req, res) {
		console.log(req.body);
	    // var user = req.body.user;
	    // var pass = req.body.pass;
	    // var param = {
	    //     username: user,
	    //     password: pass
	    // }
	    // console.log(req.body)
	    // console.log(param)
	    res.render('new_fooditem');
	})

	return app;
}();