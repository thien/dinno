var bf = require('../functions/basefunctions');
var express = require('express');
var app = express();
var login = require('../functions/login');
const db = require('../functions/database');
app.locals.basedir = "." + '/views';

function getFoodInfo(mealId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Meal.Name, Meal.Description, Meal.Image, Location.HouseNoName, Location.Street, Location.Latitude, Location.Longitude, User.Firstname, User.Surname, User.ProfileImage, User.Rating, User.UserID
				FROM Meal
				JOIN User 
				ON User.UserID = Meal.UserID
				JOIN Location 
				ON Location.LocationID = Meal.LocationID 
				WHERE Meal.MealID = ?`, [mealId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else if (results.length == 0) {
					console.log('Meal not found');
					reject('Meal not found');
				} else {
					resolve(results[0]);
				}
			});
	});
}

function claimMeal(mealId, userID) {
	return new Promise(function(resolve, reject) {
		db.query(`UPDATE Meal 	
							SET RecipientID = ?
							WHERE MealID = ?`, 	
						[userID, mealId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else if (results.length == 0) {
					console.log('Meal not found');
					reject('Meal not found');
				} else {
					resolve(results[0]);
				}
			});
	});
}

module.exports = function() {
	app.get('/fooditem', function(req, res) {

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

			var mealId = req.query.id;

			if (mealId) {
				getFoodInfo(mealId).then(function(data) {
					param.data = data;
					res.render('fooditem', param);

				}, function(err) {
					param.error_message = {
						msg: err
					};
					res.render('error', param);
				});
			} else {
				param.error_message = {
					msg: 'No mealId provided'
				};
				res.render('error', param);
			}



		}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});

	}),

	app.post('/fooditem', function(req, res) {
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

			var mealId = req.query.id;

			if (mealId) {
				var claim = claimMeal(mealId, result.UserID);
				var getInfo = getFoodInfo(mealId);

				Promise.all([claim, getInfo]).then(function(data) {
					param.foodInfo = data[1];
					res.render('claimed_meal', param);

				}, function(err) {
					param.error_message = {
						msg: err
					};
					res.render('error', param);
				});
			} else {
				param.error_message = {
					msg: 'No mealId provided'
				};
				res.render('error', param);
			}



		}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});

	})

	

	return app;
}();