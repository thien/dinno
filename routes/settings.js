const express = require('express');
const app = express();
const db = require('../functions/database');
var login = require('../functions/login');
var Cookies = require("cookies");

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

	app.get('/settings', function(req, res) {
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
					
			res.render('settings',param);
			

		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})


	app.post('/settings', function(req, res) {
		var param = req.body;
		param.loggedin = false;
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
			
			var settingsData = req.body;
			
			updateUserSettings(settingsData, param.user_data.userID).then(function(result) {	
				
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