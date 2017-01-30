var db = require('../functions/database');
var express = require('express');
var app = express();
app.locals.basedir = "." + '/views';

module.exports = function(){

	app.get('/search', function (req, res) {
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
	    var user_foods = [
		    {
	            "foodname": "ASd",
	            "image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
	            "urle": "#",
	            "marker":{
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
	            "marker":{
	            	lat: 54.778665,
	        		lng: -1.5588949
	        	}
	        },{
	            "foodname": "ASd",
	            "image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
	            "urle": "#",
	            "description": "asdf lol mofo mitchel can eat a poo",
	            "last_updated": "3",
	            "marker":{
	            	lat: 54.778665,
	        		lng: -1.5588949
	        	}
	        },{
	            "foodname": "ASd",
	            "image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
	            "urle": "#",
	            "description": "asdf lol mofo mitchel can eat a poo",
	            "last_updated": "3",
	            "marker":{
	            	lat: 54.778665,
	        		lng: -1.5588949
	        	}
	        }, {
	            "foodname": "ASd",
	            "image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
	            "urle": "#",
	            "description": "asdf lol mofo",
	            "last_updated": "3",
	            "marker":{
	            	lat: 54.768665,
	        		lng: -1.5688949
	        	}
	        }
        ];

        var random_foods_list = [generateRandomListing(),generateRandomListing(),generateRandomListing(),generateRandomListing(),generateRandomListing(),generateRandomListing(),generateRandomListing()]

	   	var food_item_query = req.query.food;
	    var param = {
	        food: food_item_query,
	        fooditems: random_foods_list
	    }

	    // console.log("someone's searching for", param)

	    res.render('searchitem', param);
	})

	return app;
}();


// Functions and Misc. go below:

function generateRandomListing(){
	var random = {
		"foodname": generateRandomFoodName(),
		"food_id": Math.round(Math.random()*1000),
		"user_id": Math.round(Math.random()*1000),
		"image": "https://unsplash.it/600,"+Math.round(Math.random()*1000)+"/?random",
		"urle": "#",
		"marker":{
			lat: 54.766866 + Math.random()/10,
			lng: -1.5749834 + Math.random()/10
	    },
	    "description": generateRandomDescription(),
	    "last_updated": Math.round(Math.random()*10)
	}
	return random;
}

function generateRandomFoodName(){
	var item = "";
	var fooditems = require("../data/random_food_list.json");
	item = fooditems.dishes[Math.floor(Math.random() * (fooditems.dishes.length))];
	return item;
}

function generateRandomDescription(){
	var subjects=['I','You','Bob','John','Sue','Kate','The lizard people'];
	var verbs=['will search for','will get','will find','attained','found','will start interacting with','will accept','accepted'];
	var objects=['Billy','an apple','a Triforce','the treasure','a sheet of paper'];
	var endings=['.',', right?','.',', like I said.','.',', just like your momma!'];

	var desc = subjects[Math.round(Math.random()*(subjects.length-1))]+' '+verbs[Math.round(Math.random()*(verbs.length-1))]+' '+objects[Math.round(Math.random()*(objects.length-1))]+endings[Math.round(Math.random()*(endings.length-1))];
	return desc;
}
