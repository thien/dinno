const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const db = require('../functions/database');
var login = require('../functions/login');
var location = require('../functions/location');
var Cookies = require("cookies");
var getJSON = require('get-json');

function validateName(name){
	// no reason why you couldnt have numbers
	// var hasNumber = /^(.*[0-9].*)$/
	return name.length > 0;
}

function validateType(type){
	return type == 'Meal' || type == 'Ingredient';
}

function validateDescription(description){
	return description.length > 0;
}

function validateBestBefore(day, month, year){
	//basically check that the best before hasn't been yet
	var today = new Date();
	var bb = new Date(year, month - 1, day, 0, 0, 0, 0);
	return today.getTime() < bb.getTime();
}

function validateLocation(lat, lng){
	//what is a valid location? just valid numbers
	return true;
	var isValidLocation = /^[0-9]?[0-9]?[0-9]\.[0-9]+$/g;
	return isValidLocation.test(lat) && true;	//isValidLocation.test(lng) returning false when it should be true
}

function validateImage(image){
	// Needs to support more file extensions than just jpg
	return true;
	// var isValidImageURL = /^http:\/\/i\.imgur\.com\/[a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9]\.jpg$/g;
	// return isValidImageURL.test(image);
}

function validateBarcode(barcode){
	// barcodes are optional and should be processed on the client side anyway
	return true;
	// var isNumbers = /^[0-9]*$/g;
	// return isNumbers.test(barcode);
}


function addNewMeal(mealData, userId, lat, lng) {
	return new Promise(function(resolve, reject) {
		var year = mealData['year'];
		var month = mealData['month'];
		var day = mealData['day'];
		var bestBefore = `${year}/${month}/${day}`;
		var isIngredient = mealData.foodtype == 'Ingredient';

		location.addNewLocation(lat,lng).then(function(locationId) { 
			db.query(`INSERT INTO Meal (MealID, LocationID, UserID, RecipientID, Name, BestBefore, Description, Image, IsIngredient,IsAvailable)
								VALUES (0, ?, ?, NULL, ?, ?, ?, ?, ?, 1)`, 
							[locationId, userId, mealData.name, bestBefore, mealData.description, mealData.image, isIngredient],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else {
					console.log(`Added meal ${mealData.name}`);
					resolve(results);
				}
			});

		}, function(err) {
			reject(err);
		});		
	});
}

function updateMeal(mealData, mealId, lat, lng) {
	return new Promise(function(resolve, reject) {
		var year = mealData['year'];
		var month = mealData['month'];
		var day = mealData['day'];
		var bestBefore = `${year}/${month}/${day}`;
		var isIngredient = mealData.foodtype == 'Ingredient';

		location.addNewLocation(lat,lng).then(function(locationId) { 
			db.query(`UPDATE Meal
								SET LocationID = ?, Name = ?, BestBefore = ?, Description = ?, Image = ?, IsIngredient = ?
								WHERE MealID = ?`, 
							[locationId, mealData.name, bestBefore, mealData.description, mealData.image, isIngredient, mealId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else {
					console.log(`Updated meal ${mealData.name}`);
					resolve(results);
				}
			});

		}, function(err) {
			reject(err);
		});		
	});
}

function checkMealOwner(mealId, userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT COUNT(*) AS isOwner
							FROM Meal
							WHERE MealID = ? AND UserID = ?`, 
						[mealId, userId],
		function(error, results, fields) {
			if (error) {
				console.log(error);
				reject(error);
			} 
			else if (!results[0].isOwner){
				reject(`This isn't your meal`);
			}
			else {
				resolve();
			}
		});	
	});
}

function getMealInfo(mealId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Meal.*, Location.Latitude, Location.Longitude, Location.HouseNoName, Location.Street, Location.Postcode
							FROM Meal
							JOIN Location 
							ON Meal.LocationID = Location.LocationID
							WHERE Meal.MealID = ?`, 
						[mealId],
		function(error, results, fields) {
			if (error) {
				console.log(error);
				reject(error);
			} 
			else if (results.length == 0){
				reject(`Meal not found`);
			}
			else {
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
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
			};

			res.render('new_fooditem', param);
		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})

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
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
				
			};
		
			var mealId = req.params.id;
			if (mealId) {

				checkMealOwner(mealId, result.UserID).then(function(result) {
					getMealInfo(mealId).then(function(mealInfo) {
						// stupid conversion makes me sad
						param.edit = true;
						param.name = mealInfo.Name;
						param.description = mealInfo.Description;
						param.image = mealInfo.Image;
						param.location = `${mealInfo.HouseNoName} ${mealInfo.Street} ${mealInfo.Postcode}`;
						param.isIngredient = mealInfo.IsIngredient;
						param.lat = mealInfo.Latitude;
						param.lng = mealInfo.Longitude;
						var bb = mealInfo.BestBefore.toISOString();
						param.year = bb.substring(0,4)
						param.month = bb.substring(5,7)
						param.day = bb.substring(8,10)
						res.render('new_fooditem', param);
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
			}

			else {
				param.error_message = {
					msg: 'No meal id specified'
				};
				res.render('error', param);
			}
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
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
			};



			var mealData = req.body;
			
			// console.log(validateName(mealData.name)); console.log(validateType(mealData.foodtype));  console.log(validateDescription(mealData.description));  console.log(validateBestBefore(mealData.day, mealData.month, mealData.year));  console.log(validateLocation(mealData.lat, mealData.lng));  console.log(validateImage(mealData.image));  console.log(validateBarcode(mealData.barcode));
	
			if(validateName(mealData.name) && validateType(mealData.foodtype) && validateDescription(mealData.description) && validateBestBefore(mealData.day, mealData.month, mealData.year) && validateLocation(mealData.lat, mealData.lng) && validateImage(mealData.image) && validateBarcode(mealData.barcode)){

				if (mealData.useCurrentLocation) {
					var cookies = new Cookies(req, res);
				  	mealData.lat = cookies.get('lat');
					mealData.lng = cookies.get('lng');
				}

				addNewMeal(mealData, result.UserID, mealData.lat, mealData.lng).then(function(result) {	

					param.new_item = {
						name: mealData.name,
						image: mealData.image,
						id: result.insertId
					}
					
					res.render('added_fooditem', param);

				}, function(err) {
						param.error_message = {
							msg: err
						};
						res.render('error', param);
				});
			}
			else{
				param.error_message = {
					msg: 'Some of the information you entered was not valid'
				};
				res.render('error', param);
			}

		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	}),

	app.post('/edit/:id', function(req, res) {
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

			var mealData = req.body;
			var mealId = req.params.id;
			
			if (mealId) {

				checkMealOwner(mealId, result.UserID).then(function(result) {
					
					if (mealData.useCurrentLocation) {
						var cookies = new Cookies(req, res);
					  mealData.lat = cookies.get('lat');
						mealData.lng = cookies.get('lng');
					}

					updateMeal(mealData, mealId, mealData.lat, mealData.lng).then(function(result) {	
							param.new_item = {
								name: mealData.name,
								image: mealData.image,
								id: mealId
							}
							param.edit = true;
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
			}

			else {
				param.error_message = {
					msg: 'No meal id specified'
				};
				res.render('error', param);
			}

		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})

	return app;
}();