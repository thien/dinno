const express = require('express');
const app = express();
const db = require('../functions/database');
var login = require('../functions/login');
var Cookies = require("cookies");

function addNewMeal(mealData, userId) {
	return new Promise(function(resolve, reject) {
		var year = mealData['year'];
		var month = mealData['month'];
		var day = mealData['day'];
		var bestBefore = `${year}/${month}/${day}`;
	
		var isIngredient = mealData.foodtype == 'Ingredient';

		db.query(`INSERT INTO Meal (MealID, LocationID, UserID, RecipientID, Name, BestBefore, Description, Image, IsIngredient)
							VALUES (0, ?, ?, NULL, ?, ?, ?, ?, ?)`, 
						[mealData.location, userId, mealData.name, bestBefore, mealData.description, mealData['images[]'], isIngredient],
		function(error, results, fields) {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				console.log(`Added meal ${mealData.name}`);
				resolve(results);
			}
		});
	});
}

module.exports = function() {
	var express = require('express');
	var app = express();
	var login = require('../functions/login');
	app.locals.basedir = "." + '/views';

	app.get('/add', function(req, res) {
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

			res.render('new_fooditem', param);
		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})

	app.post('/add', function(req, res) {
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

			var mealData = req.body;
			addNewMeal(mealData, result.UserID).then(function(result) {	

					param.new_item = {
						name: mealData.name,
						image: mealData['images[]'],
						id: result.insertId
					}
					res.render('added_fooditem', param);


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