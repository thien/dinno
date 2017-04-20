const express = require('express');
const app = express();
const fs = require('fs');
const db = require('../functions/database');
const encrypt = require('../functions/encrypt');
var login = require('../functions/login');
var Cookies = require("cookies");

app.locals.basedir = "." + '/views';

module.exports = function() {

	app.get('/faqs', function(req, res) {
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
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
			};
			
			res.render('faqs', param);

		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})

	return app;
}();