var express = require('express');
	var app = express();
	var login = require('../functions/login');
	var Cookies = require("cookies");
module.exports = function() {
	app.locals.basedir = "." + '/views';

	app.get('/', function(req, res) {
		var param = {
			loggedin: false,
		};

		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			var cookies = new Cookies(req, res);
			userId = cookies.get('id');

			// var profileInfo = getProfileInfo(userId);

			param.user_data = {
				userID: userId,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
			};


			res.render('frontpage', param);
		}, function(err) {
			res.render('frontpage',param);
		});

	})

	return app;
}();