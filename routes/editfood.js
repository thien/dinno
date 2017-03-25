var bf = require('../functions/basefunctions');
var express = require('express');
var app = express();
var login = require('../functions/login');
const db = require('../functions/database');
app.locals.basedir = "." + '/views';

module.exports = function() {

	app.get('/edit/:id', function(req, res) {
		var param = {
			loggedin: false,
		};

		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;

			param.user_data = {
				userID: result.UserID,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			var mealId = req.params.id;

			if (mealId) {
				getFoodInfo(mealId).then(function(data) {
					console.log(data);
					param.data = data;
					res.render('edit_fooditem', param);

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

function getFoodInfo(mealId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Meal.Name, Meal.Description, Meal.Image, Location.HouseNoName, Location.Street, Location.Latitude, Location.Longitude, User.Firstname, User.Surname, User.ProfileImage, User.Rating
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