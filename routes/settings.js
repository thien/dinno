const express = require('express');
const app = express();
const db = require('../functions/database');
var login = require('../functions/login');
var Cookies = require("cookies");

//Updates the user settings from the form details on the page for the specified user (by their userId)
//Input: settingsData, userId
//Output: null
function updateUserSettings(settingsData, userId) {
	return new Promise(function(resolve, reject) {

		db.query(`UPDATE User
					SET TextSize = ?, ColourScheme = ?
					WHERE UserID = ?`, 
					[settingsData.textSize, settingsData.colourScheme, userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else {
					console.log(`Updated user ${userId}'s text size to ${settingsData.textSize} and colour scheme ${settingsData.colourScheme}`);
					resolve(results);
				}
		});

		
	});
}

//Gets the user settings for the specified user (by their userId)
//Input: userId
//Output: Array containing TextSize, ColourScheme
function getUserSettings(userId) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT TextSize, ColourScheme
                  FROM User
                  WHERE UserID = ?`, 
                [userId], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject(error);
                  }
                  else if (results.length == 0) {
                    console.log('UserID not found');
                    console.log(results);
                    reject("User not found");
                  }
                  else{
                    resolve(results[0]);
                  }
                });
    });
}

module.exports = function() {
	var express = require('express');
	var app = express();
	var login = require('../functions/login');
	app.locals.basedir = "." + '/views';

	
	//For when the settings page is loaded.
	app.get('/settings', function(req, res) {
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
			
			//Render the page.
			res.render('settings',param);
			

		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})

	//For when the update settings button is pressed.
	app.post('/settings', function(req, res) {
		var param = req.body;
		param.loggedin = false;
		
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
			
			//Get the form data from the page.
			var settingsData = req.body;
			
			//Update the user settings in the database.
			updateUserSettings(settingsData, param.user_data.userID).then(function(result) {	
				
				//Load the updated details into parameters and set a success alert before loading the page.
				param.user_data.textSize = settingsData.textSize;
				param.user_data.colourScheme = settingsData.colourScheme;
				param.alerts = {
					warning: [],
					info : [],
					error : [],
					success : ["Your settings have been successfully updated."]
				}
				
				console.log(param)
				
				res.render('settings', param);


			}, function(err) {
					param.error_message = {
						msg: err
					};
					res.render('error', param);
			});
			

		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})
	
	return app;
}();