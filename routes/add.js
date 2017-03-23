module.exports = function() {
    var express = require('express');
    var app = express();
    var login = require('../functions/login');
    app.locals.basedir = "." + '/views';

    app.get('/add', function(req, res) {
        login.checkLogin(req, res).then(function(result) {
            res.render('new_fooditem');
        }, function(err) {
            var error_message = {
				msg:"You're not logged in."
			};
			res.render('error', error_message);
        });
    })

    app.post('/add', function(req, res) {
        login.checkLogin(req, res).then(function(result) {
            res.render('new_fooditem');
        }, function(err) {
            var error_message = {
				msg:"You're not logged in."
			};
			res.render('error', error_message);
        });
    })

    return app;
}();