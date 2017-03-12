var db = require('../functions/database');
var bf = require('../functions/basefunctions');
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
	            "best_before": Date.parse("01 Mar 2017 00:00:00"),
	            "last_updated": "3"
	        }, {
	            "foodname": "ASd",
	            "image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
	            "urle": "#",
	            "description": "asdf lol mofo mitchel can eat a poo",
	            "best_before": Date.parse("05 Mar 2017 00:00:00"),
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
	            "best_before": Date.parse("09 Feb 2017 00:00:00"),
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
	            "best_before": Date.parse("14 Feb 2017 00:00:00"),
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
	            "best_before": Date.parse("22 Feb 2017 00:00:00"),
	            "last_updated": "3",
	            "marker":{
	            	lat: 54.768665,
	        		lng: -1.5688949
	        	}
	        }
        ];

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
	    var param = {
	        food: food_item_query,
	        fooditems: random_foods_list
	    }

	    console.log("someone's searching for", param)

	    res.render('searchitem', param);
	})

	return app;
}();
