var express = require('express');
var app = express();
var Cookies = require("cookies");
var login = require('../functions/login');
var db = require('../functions/database');
var bf = require('../functions/basefunctions');

app.locals.basedir = "." + '/views';

function getPostedClaimedMeals(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Meal.MealID, Meal.Name, Meal.Description, Meal.Image, Meal.BestBefore, User.ProfileImage, User.Firstname, User.Surname, User.UserID, Meal.RecipientID, Meal.Rating
				  FROM Meal
				  JOIN User 
				  ON User.UserID = Meal.RecipientID
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

function getPostedUnclaimedMeals(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Meal.MealID, Meal.Name, Meal.Description, Meal.Image, Meal.BestBefore, Meal.RecipientID, Meal.Rating
				  FROM Meal
				  WHERE Meal.UserID = ? AND Meal.RecipientID IS NULL`, [userId],
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
		db.query(`SELECT Meal.MealID, Meal.Name, Meal.Description, Meal.Image, Meal.BestBefore, User.ProfileImage, User.Firstname, User.Surname, Meal.RecipientID, Meal.UserID, Location.HouseNoName, Location.Street, Location.Town, Location.LocationID, Meal.Rating
				  FROM Meal
				  JOIN User 
				  ON User.UserID = Meal.UserID
				  JOIN Location
				  ON Location.LocationID = Meal.LocationID
				  WHERE Meal.RecipientID = ?`, [userId],
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

function removeMeal(userId, mealId) {
	return new Promise(function(resolve, reject) {
		db.query(`DELETE FROM Meal
							WHERE UserID = ? AND MealID = ?;`, 
							[userId, mealId],
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

function cancelMeal(userId, mealId) {
	return new Promise(function(resolve, reject) {
		db.query(`UPDATE Meal
							SET RecipientId = NULL
							WHERE RecipientId = ? AND MealID = ?;`, 
							[userId, mealId],
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
			var postedclaimed = getPostedClaimedMeals(userID);
			var postedunclaimed = getPostedUnclaimedMeals(userID);
			var received = getReceivedMeals(userID);
			Promise.all([postedclaimed, postedunclaimed, received]).then(function(data) {
				
				param.fooditems = {};
				param.fooditems.postedclaimed = data[0];
				param.fooditems.postedunclaimed = data[1];
				param.fooditems.received = data[2];
				param.user_data = {
					userID: userID,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage,
					textSize: result.TextSize,
					colourScheme: result.ColourScheme,
					isAdmin: result.IsAdmin
				};
				
				if (req.query.type){
					if (req.query.type === "others"){
						param.defaultToggle = false;
					} else {
						param.defaultToggle = true;
					}
				}
				res.render('manage', param);

			},function(err) {
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
	}),

	app.post('/manage', function (req, res) {
			var param = {
				loggedin: false,
			};
			login.checkLogin(req, res).then(function (result) { //check login of user
				param.loggedin = true;
				userID = result.UserID;
				db.query('UPDATE Meal SET Rating = ? WHERE MealID = ?', [req.body.rating,req.body.mealID], function (err, results, fields) { //set rating to what user posted
					if (err) {
						res.status(200).send({ success: false , error_message:err})
					} else {
						res.status(200).send({ success: true })
					}
				}, function (err) {
					param.error_message = {
						msg: err
					};
					res.render('error', param);
				});
			}, function (err) {
				param.error_message = {
					msg: err
				};
				res.send('error', param);
			});
		}),
	
	app.get('/remove', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			userID = result.UserID;
			var mealId = req.query.id
			var remove = removeMeal(userID, mealId);
				
			Promise.all([remove]).then(function(data) {

				res.redirect('/manage');

			},function(err) {
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
	}),

	app.get('/cancel', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			userID = result.UserID;
			var mealId = req.query.id
			var cancel = cancelMeal(userID, mealId);
				
			Promise.all([cancel]).then(function(data) {

				param.alerts = {
					warning: [],
					info : [],
					error : [],
					success : ["The item has been cancelled successfully."]
				}
				res.render('manage', param);

			},function(err) {
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