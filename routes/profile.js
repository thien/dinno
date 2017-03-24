var express = require('express');
var app = express();
var Cookies = require("cookies");
var login = require('../functions/login');
var db = require('../functions/database');
var bf = require('../functions/basefunctions');

app.locals.basedir = "." + '/views';

module.exports = function() {

	app.get('/manage', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			var cookies = new Cookies(req, res);
			userId = cookies.get('id');

			// var profileInfow = getProfileInfo(userId);

			param.user_data = {
				userID: userId,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			param.alerts = {
					warning: [],
					info : [],
					error : [],
					success : ["Your data has been updated successfully."]
				}

		

				res.render('manage', param);

			}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});
	})
	return app;
}();