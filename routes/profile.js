var express = require('express');
var app = express();
var Cookies = require("cookies");
var login = require('../functions/login');
var db = require('../functions/database');
var report = require('../functions/report');
var bf = require('../functions/basefunctions');

app.locals.basedir = "." + '/views';

function getProfileInfo(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT *,
				  YEAR(CURRENT_TIMESTAMP) - YEAR(DOB) - (RIGHT(CURRENT_TIMESTAMP, 5) < RIGHT(DOB, 5)) + 1 as Age,
				  CEILING((COALESCE(SUM(Meal.Rating),0) + 5 ) / (COALESCE(COUNT(Meal.Rating),0) + 1)) as UserRating
				  FROM User
				  LEFT JOIN Meal
				  ON User.UserID = Meal.UserID
				  WHERE User.UserID = ?
				  GROUP BY Meal.UserID;`, [userId],
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

function getLastPostedLocation(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Location.Town
							FROM User 
							JOIN Meal
							ON User.UserID = Meal.UserID
							JOIN Location
							ON Location.LocationID = Meal.LocationID
							WHERE User.UserID = ?
							ORDER BY Meal.MealID DESC`, [userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else if (results.length == 0) {
					console.log('UserID not found');
					resolve({Town : ""});
				} else {
					console.log(results);
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
				  WHERE Meal.UserID = ? AND Meal.IsAvailable = 1`, [userId],
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
				userID: result.UserID,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
				
			};

			var profileInfo = getProfileInfo(userId);
			var userMeals = getUserMeals(userId);
			var reportCount = report.getReportCount(userId);
			var lastLocation = getLastPostedLocation(userId);

			Promise.all([profileInfo, userMeals, lastLocation, reportCount]).then(function(data) {
				console.log(":"+data[0].UserRating);
				param.page_data = {
					name: `${data[0].Firstname} ${data[0].Surname}`,
					age: data[0].Age,
					userId: userId,
					profile_photo: data[0].ProfileImage,
					user_location: data[2].Town,
					rating: data[0].UserRating,
					no_reviews: 17,
					reviews: 'review',
					fooditems: data[1],
					reportCount: data[3][0].reportCount,
					isAdmin: data[0].IsAdmin,
					isSuspended: data[0].IsSuspended,
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
				msg: "You need to be logged in to access this page."
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

			var profileInfo = getProfileInfo(userId);

			param.user_data = {
				userID: userId,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
			};

			Promise.all([profileInfo]).then(function(data) {
				
				var dob = data[0].DOB.toString().split(' ');
				param.forename =  `${data[0].Firstname}`,
				param.surname = `${data[0].Surname}`,
				param.profileImage = data[0].ProfileImage,
				param.email = data[0].EmailAddress,
				param.year = dob[3];
				param.month = data[0].DOB.getMonth()+1;
				param.day = dob[2];
				param.edit =  true,
				param.alerts = {
					warning: [],
					info : [],
					error : [],
					success : ["Your data has been updated successfully."]
				}

				res.render('register', param);

			}, function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
			});
		}, function(err) {
			param.error_message = {
				msg: "You need to be logged in to access this page."
			};
			res.render('error', param);
		});
	})
	return app;
}();