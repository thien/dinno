var express = require('express');
var app = express();
var login = require('../functions/login');
var Cookies = require("cookies");
var db = require('../functions/database');
var Cookies = require("cookies");

function getBackgroundImage() {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Image FROM Meal
			  ORDER BY RAND()
			  LIMIT 20`,
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else {
					var k = []
					for (var i in results) {
						// console.log(i);
						// console.log(results[i].image)
						k.push(results[i].Image);
					}
					resolve(k);
				}
			});
	});
}

function getRandomUser(userID) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Firstname, Surname, UserID 
							FROM User
							WHERE User.UserID <> ?
							ORDER BY RAND()
							LIMIT 1`, [userID],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else if (results.length == 0) {
					console.log(results);
					console.log('No random user found');
					reject('No random user found');
				} else {
					var res = results[0];
					var tip = {
						msg: `Why not ask ${res.Firstname} ${res.Surname} if they want some of your spare food?`,
						link: `/chat?id=${res.UserID}`
					}
					resolve(tip);
				}
			});
	});
}

function getRandomRecievedMeal(userID) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Meal.Name, User.UserID, User.Firstname, User.Surname
						 FROM Meal
						 JOIN User 
						 ON Meal.UserID = User.UserID
						 WHERE Meal.RecipientID = ?
						 AND Meal.UserID <> ?
			 ORDER BY RAND()
			 LIMIT 1`, [userID, userID],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else if (results.length == 0) {
					console.log(results);
					console.log('No random user found');
					reject('No random user found');
				} else {
					var res = results[0];
					var tip = {
						msg: `Why not ask ${res.Firstname} ${res.Surname} if they have any more ${res.Name}?`,
						link: `/chat?id=${res.UserID}`
					}
				}
				resolve(tip);
			});
	});
}

function getRandomDonatedMeal(userID) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Meal.Name, User.UserID, User.Firstname, User.Surname
						 FROM Meal
						 JOIN User 
						 ON Meal.RecipientID = User.UserID
						 WHERE Meal.UserID = ?
					   AND Meal.RecipientID <> ?
			 ORDER BY RAND()
			 LIMIT 1`, [userID, userID],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else if (results.length == 0) {
					console.log(results);
					console.log('No random user found');
					reject('No random user found');
				} else {
					var res = results[0];
					var tip = {
						msg: `Why not ask ${res.Firstname} ${res.Surname} if they want any more ${res.Name}?`,
						link: `/chat?id=${res.UserID}`
					}
				}
				resolve(tip);
			});
	});
}

function getRandomAvailableMeal(userID) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Meal.Name, Meal.MealID, Location.Town
						 FROM Meal
						 JOIN Location
						 ON Meal.LocationID = Location.LocationID
						 WHERE Meal.UserID <> ?
						 AND Meal.RecipientID IS NULL
			 ORDER BY RAND()
			 LIMIT 1`, [userID],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else if (results.length == 0) {
					console.log(results);
					console.log('No random user found');
					reject('No random user found');
				} else {
					var res = results[0];
					var tip = {
						msg: `${res.Name} in ${res.Town}?`,
						link: `/fooditem?id=${res.MealID}`
					}
				}
				resolve(tip);
			});
	});
}

function getHelpfulTip(userID) {
	var choice = Math.random();
	if (choice < 0.25) {
		return getRandomRecievedMeal(userID);
	} else if (choice < 0.5) {
		return getRandomDonatedMeal(userID);
	} else if (choice < 0.75) {
		return getRandomAvailableMeal(userID);
	} else {
		return getRandomUser(userID);
	}
}

module.exports = function() {
	app.locals.basedir = "." + '/views';

	app.get('/', function(req, res) {
		var param = {
			loggedin: false,
		};

		getBackgroundImage().then(function(backgrounds) {
			// param.background = background;
			param.backgrounds = backgrounds;

			login.checkLogin(req, res).then(function(result) {
				param.loggedin = true;
				userId = result.UserID;
				param.user_data = {
					userID: userId,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage,
					textSize: result.TextSize,
					colourScheme: result.ColourScheme,
					isAdmin: result.IsAdmin
				};

				getHelpfulTip(userId).then(function(tip) {
					param.tip = tip;
					res.render('frontpage', param);
				}, function(err) {
					// get backup tip if random one wasnt found
					getRandomUser(userId).then(function(tip) {
						param.tip = tip;
						res.render('frontpage', param);
					}, function(err) {
						res.render('frontpage', param);
					})
				})

			}, function(err) {

				req.io.on('connection', function(socket) {
					socket.emit('pdiddy', "haha");
				});

				res.render('frontpage', param);
			});
		}, function(err) {
			res.render('frontpage', param);
		});

	})

	return app;
}();