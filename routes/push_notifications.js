var bf = require('../functions/basefunctions');
var express = require('express');
var app = express();
const notifications_server = require('http').Server(app);
const notifications_io = require('socket.io')(notifications_server);
var login = require('../functions/login');
const db = require('../functions/database');
app.locals.basedir = "." + '/views';

// load socket file from functions folder
require('./functions/notifications_socket')(notifications_io, notifications_server);

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