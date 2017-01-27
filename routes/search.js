var db = require('../functions/database');
var express = require('express');
var app = express();
app.locals.basedir = "." + '/views';

module.exports = function(){

	app.get('/search', function (req, res) {
	    var food_item = req.query.food;
	    var param = {
	        food: food_item
	    }
	    console.log("someone's searching for", param)

	    db.query('SELECT * FROM availableFood WHERE(availableFood.Food LIKE ?)',[food_item], function (error, results, fields) {
	        // error will be an Error if one occurred during the query
	        // results will contain the results of the query
	        // fields will contain information about the returned results fields (if any)
	        console.log(fields);
	    });

	    res.render('searchitem', param);
	})

	return app;
}();