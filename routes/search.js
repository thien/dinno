var db = require('../functions/database');
var bf = require('../functions/basefunctions');
var mysql = require('mysql')
var express = require('express');
var app = express();
var login = require('../functions/login');
app.locals.basedir = "." + '/views';

module.exports = function(){

	app.get('/search', function (req, res) {

		login.checkLogin(req, res).then(function(result) {
			console.log(req.query);
			var query = "SELECT * FROM ?? WHERE(?? LIKE ?)"
			var meal = false;
			var single = true
			var foods
			if(meal){
				foods = ["%" + req.query.food +  "%"]
				foods.splice(0,0,"meal","Name")
				console.log(foods)
			}else{
				foods = req.query.food.split(" ")
				foods.splice(0,0,"ingredient","Name")
				var operator = " OR "
				if(single){
					operator = " AND "
				}
				for(i = 2; i < foods.length-1 ; i++){
					query += operator + "(`Name` LIKE ?)"
				}
			}
			
			query += ";"
			query = mysql.format(query,foods)
			console.log(query)
		    // will need to deal with queries
		    db.query(query,foods, function (error, results, fields) {
		        // error will be an Error if one occurred during the query
		        // results will contain the results of the query
		        // fields will contain information about the returned results fields (if any)
		        console.log(results);
		    });

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

		    // console.log("someone's searching for", param)
				res.render('searchitem', param);
    }, function(err) {
      res.render('frontpage');
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