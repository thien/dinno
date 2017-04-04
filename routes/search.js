var db = require('../functions/database');
var bf = require('../functions/basefunctions');
var mysql = require('mysql')
var express = require('express');
var app = express();
var login = require('../functions/login');
var distance = require('google-distance');

app.locals.basedir = "." + '/views';

module.exports = function() {

	app.get('/search', function(req, res) {
		var param = {
			loggedin: false,
		};

		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			// !IMPORTANT; THE USER ID NEEDS TO BE FOUND!!!
			param.user_data = {
				userID: 666,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			console.log(req.query);
			var query = "SELECT * FROM ?? JOIN `Location` ON `Meal`.`LocationID` = `Location`.`LocationID` WHERE(?? LIKE ?)"
			var meal = (req.query.isMeal == 'true')
			var latDif = 1/69
			var longDif = 1/69;
			distance.apiKey = 'AIzaSyCRkjhwstQA0YAqgmXH0-nmrO_hJ1m6pao';
			if(req.query.isMeal == 'both'){
				meal = true;
			}
			var foods
			if(req.query.food != ""){
				if (req.query.isMeal == 'true') {
				foods = ["%" + req.query.food + "%"]
				foods.splice(0, 0, "Meal", "Name")
				console.log(foods)
				query += " AND `IsIngredient` = 0"
			} else {
				foods = req.query.food.split(" ")
				foods.splice(0, 0, "Meal", "Name")
				var operator = " OR "
				for (i = 2; i < foods.length - 1; i++) {
					query += operator + "(`Name` LIKE ?)"
				}
				if(req.query.isMeal != 'both'){
					query += " AND `IsIngredient` = 1"
				}
			}
			if(req.query.radius != undefined){
				latDif = req.query.radius/69;
				longDif = req.query.radius/69;
			}
			query += " AND `Location`.`Latitude` BETWEEN " + (req.query.lat - latDif) + " AND " + (parseFloat(req.query.lat) + parseFloat(latDif))
			query += " AND `Location`.`Longitude` BETWEEN " + (req.query.lng - longDif) + " AND " + (parseFloat(req.query.lng) + parseFloat(longDif)) 
			query += ";"
			query = mysql.format(query, foods)
			console.log(query)
			// will need to deal with queries
			db.query(query, foods, function(error, results, fields) {
				var data = []
				var count = 0
				// error will be an Error if one occurred during the query
				// results will contain the results of the query
				// fields will contain information about the returned results fields (if any)
				//console.log(results);
				for(var i = 0;i < results.length;i++){
					//console.log(results[i].Latitude + "," + results[i].Longitude)
					distance.get({origin: "" + req.query.lat+","+req.query.lng, destination: ""+results[i].Latitude+","+results[i].Longitude,units: 'imperial'},function(err,distanceData){
						if (err) return console.log(err);
						if(parseFloat(distanceData.distance.substring(0,distanceData.distance.length-3)) <= req.query.radius){
							//console.log(distanceData);
						}else{
							results[i]=""
						}
						// if(distanceData.distanceValue <= 1609*req.query.radius){
						// 	console.log(distanceData);
						// }else{
						// 	results[i]=""
						// }
						count++
						if(count == results.length){
							console.log(results + "results")
						}
					})
				}
			});
			}

			// will need to get search results
			// user id's
			var user_foods = [{
				"foodname": "ASd",
				"image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
				"urle": "#",
				"marker": {
					lat: 54.766866,
					lng: -1.5749834
				},
				"description": "asdf lol mofo james is a plop",
				"last_updated": "3"
			}, {
				"foodname": "ASd",
				"image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
				"urle": "#",
				"description": "asdf lol mofo mitchel can eat a poo",
				"last_updated": "3",
				"marker": {
					lat: 54.778665,
					lng: -1.5588949
				}
			}, {
				"foodname": "ASd",
				"image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
				"urle": "#",
				"description": "asdf lol mofo mitchel can eat a poo",
				"last_updated": "3",
				"marker": {
					lat: 54.778665,
					lng: -1.5588949
				}
			}, {
				"foodname": "ASd",
				"image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
				"urle": "#",
				"description": "asdf lol mofo mitchel can eat a poo",
				"last_updated": "3",
				"marker": {
					lat: 54.778665,
					lng: -1.5588949
				}
			}, {
				"foodname": "ASd",
				"image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
				"urle": "#",
				"description": "asdf lol mofo",
				"last_updated": "3",
				"marker": {
					lat: 54.768665,
					lng: -1.5688949
				}
			}];

			var random_foods_list = [
				bf.generateRandomListing(),
				bf.generateRandomListing(),
				bf.generateRandomListing(),
				bf.generateRandomListing(),
				bf.generateRandomListing(),
				bf.generateRandomListing(),
				bf.generateRandomListing()
			]

			var food_item_query = req.query.food;
			param.results = {
				food: food_item_query,
				fooditems: random_foods_list
			}

			// console.log("someone's searching for", param)
			res.render('searchitem', param);
		}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});
		// console.log(req.query);

		// will need to deal with queries
		// db.query('SELECT * FROM availableFood WHERE(availableFood.Food LIKE ?)',[food_item], function (error, results, fields) {
		//     // error will be an Error if one occurred during the query
		//     // results will contain the results of the query
		//     // fields will contain information about the returned results fields (if any)
		//     console.log(fields);
		// });

		// will need to get search results
		// user id's

	})

	return app;
}();