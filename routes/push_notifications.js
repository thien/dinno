var bf = require('../functions/basefunctions');
var express = require('express');
var app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var login = require('../functions/login');
const db = require('../functions/database');
app.locals.basedir = "." + '/views';

module.exports = function() {
	app.get('/test_notifications', function(req, res) {

		var param = {
			loggedin: false,
		};

		login.checkLogin(req, res).then(function(result) {

			param.loggedin = true;

			param.user_data = {
				userID: 123,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage,
				textSize: result.TextSize
			};

			res.render('test_notifications', param);

		}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});

	}),

	app.post('/test_notifications', function(req, res) {
		var param = {
			loggedin: false,
		};

		login.checkLogin(req, res).then(function(result) {
		
			param.loggedin = true;

			param.user_data = {
				userID: result.UserID,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage,
				textSize: result.TextSize
			};

			res.render('test_notifications', param)

		}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});

	})

	

	return app;
}();