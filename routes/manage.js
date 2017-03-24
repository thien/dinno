var express = require('express');
var app = express();
var Cookies = require("cookies");
var login = require('../functions/login');
var db = require('../functions/database');
var bf = require('../functions/basefunctions');

app.locals.basedir = "." + '/views';

function getPostedMeals(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Meal.MealID, Meal.Name, Meal.Description, Meal.Image, User.ProfileImage
				  FROM Meal
				  JOIN User 
				  ON User.UserID = Meal.UserID
				  WHERE Meal.UserID = ?`, [userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject();
				} else {
					resolve(results);
				}
			});
	});
}

function getReceivedMeals(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Meal.MealID, Meal.Name, Meal.Description, Meal.Image, User.ProfileImage
				  FROM Meal
				  JOIN User 
				  ON User.UserID = Meal.RecipientId
				  WHERE Meal.RecipientId = ?`, [userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject();
				} else {
					resolve(results);
				}
			});
	});
}
/*

Note: For /manage

Feel free to argue against; since im not sure how best this should be implemented
but in /manage you'd be able to see dinnos that you've uploaded and dinnos that you
requested. This should work similarly to how the web FAQ summative works, so the JSON
of the user's data (dinnos the user uploaded and the dinnos users requested) would
be stored on client side; which means that data manipulation would also be client side
through javascript.

This is obviously a template; implementation is absent

- Thien

*/

module.exports = function() {

	app.get('/manage', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			userID = result.UserID;
			var posted = getPostedMeals(userID);
			var received = getReceivedMeals(userID);
			Promise.all([posted, received]).then(function(data) {
				
				param.posted = data[0];
				param.received = data[1];
				param.user_data = {
					userID: userID,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage
				};
				console.log(param);
				res.render('manage', param);

			}, function (err) {
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