const express = require('express');
const app = express();
const fs = require('fs');
const db = require('../functions/database');
const encrypt = require('../functions/encrypt');
var login = require('../functions/login');
var Cookies = require("cookies");

app.locals.basedir = "." + '/views';

module.exports = function() {
	
	//For when the faqs page is loaded.
	app.get('/faqs', function(req, res) {
		var param = {
			loggedin: false,
		};
		
		//Before loading the page check the user is logged in, if not return an error.
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
		
			//Get data about the currently logged in user.
			param.user_data = {
				userID: result.UserID,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
			};
			
			//Render the page
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