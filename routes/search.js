var db = require('../functions/database');
var express = require('express');
var app = express();
app.locals.basedir = "." + '/views';

module.exports = function(){

	app.get('/search', function (req, res) {
		console.log(req.query);

	    // will need to deal with queries
	    db.query('SELECT * FROM availableFood WHERE(availableFood.Food LIKE ?)',[food_item], function (error, results, fields) {
	        // error will be an Error if one occurred during the query
	        // results will contain the results of the query
	        // fields will contain information about the returned results fields (if any)
	        console.log(fields);
	    });

	    // will need to get search results
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


	   	var food_item = req.query.food;
	    var param = {
	        food: food_item,
	        fooditems: user_foods
	    }

	    console.log("someone's searching for", param)

	    res.render('searchitem', param);
	})

	return app;
}();