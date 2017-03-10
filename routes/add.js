module.exports = function(){
	var express = require('express');
	var app = express();
	var login = require('../functions/login');
	app.locals.basedir = "." + '/views';

	app.get('/add', function (req, res) {
			login.checkLogin(req, res).then(function(result) {
        res.render('new_fooditem');
      }, function(err) {
        res.render('frontpage');
      });
	})

	app.post('/add', function (req, res) {
		login.checkLogin(req, res).then(function(result) {
      res.render('new_fooditem');
    }, function(err) {
      res.render('frontpage');
    });
	})

	return app;
}();