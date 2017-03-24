var express = require('express');
var app = express();
var Cookies = require("cookies");
var login = require('../functions/login');
var db = require('../functions/database');
var bf = require('../functions/basefunctions');

app.locals.basedir = "." + '/views';

function getProfileInfo(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT *,
				  YEAR(CURRENT_TIMESTAMP) - YEAR(DOB) - (RIGHT(CURRENT_TIMESTAMP, 5) < RIGHT(DOB, 5)) as Age
				  FROM User
				  WHERE UserID = ?`, [userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else if (results.length == 0) {
					console.log('UserID not found');
					reject('UserID not found');
				} else {
					resolve(results[0]);
				}
			});
	});
}

function getUserMeals(userId) {
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

module.exports = function() {
	app.get('/profile', function(req, res) {
		var param = {
			loggedin: false,
		};

		login.checkLogin(req, res).then(function(result) {
			// user is logged in, proceed.
			param.loggedin = true;
			var cookies = new Cookies(req, res);
			var userId = req.query.id;
			if (!userId) {
				userId = cookies.get('id');
			}
			param.user_data = {
				userID: userId,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			var profileInfo = getProfileInfo(userId);
			var userMeals = getUserMeals(userId);

			Promise.all([profileInfo, userMeals]).then(function(data) {

				param.page_data = {
					name: `${data[0].Firstname} ${data[0].Surname}`,
					age: data[0].Age,
					userId: userId,
					profile_photo: data[0].ProfileImage,
					user_location: "London",
					rating: data[0].Rating,
					no_reviews: 17,
					reviews: 'review',
					fooditems: data[1],
					ownProfile: !req.query.id
				};

				res.render('profile', param);

			}, function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
			});
		}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});
	})
	app.get('/profile/:id', function(req, res) {
		var param = {
			loggedin: false,
		};

		console.log(req.params.id)

		login.checkLogin(req, res).then(function(result) {
			// user is logged in, proceed.
			param.loggedin = true;
			var cookies = new Cookies(req, res);

			var userId = req.params.id;
			if (!userId) {
				userId = cookies.get('id');
			}
			
			param.user_data = {
				userID: userId,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			var profileInfo = getProfileInfo(userId);
			var userMeals = getUserMeals(userId);

			Promise.all([profileInfo, userMeals]).then(function(data) {

				param.page_data = {
					name: `${data[0].Firstname} ${data[0].Surname}`,
					age: data[0].Age,
					userId: userId,
					profile_photo: data[0].ProfileImage,
					user_location: "London",
					rating: data[0].Rating,
					no_reviews: 17,
					reviews: 'review',
					fooditems: data[1],
					ownProfile: !req.query.id
				};

				res.render('profile', param);

			}, function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
			});
		}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});
	})
	app.get('/editprofile', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			var cookies = new Cookies(req, res);
			userId = cookies.get('id');

			param.user_data = {
				userID: userId,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			var profileInfo = getProfileInfo(userId);

			param.user_data = {
				userID: userId,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			Promise.all([profileInfo]).then(function(data) {

				param.forename =  `${data[0].Firstname}`,
				param.surname = `${data[0].Surname}`,
				param.profileImage = data[0].ProfileImage,
				param.email = data[0].EmailAddress,
				param.edit =  true,

				param.alerts = {
					warning: [],
					info : [],
					error : [],
					success : ["Your data has been updated successfully."]
				}

				res.render('edit_profile', param);

			}, function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
			});
		}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});
	})
	return app;
}();