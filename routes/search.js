module.exports = function(){
	var express = require('express');
	var app = express();
	app.locals.basedir = "." + '/views';

	app.get('/search', function (req, res) {
	    var food_item = req.query.food;
	    var param = {
	        food: food_item
	    }
	    console.log("someone's searching for", param)

	    connection.query('SELECT * FROM availableFood WHERE(availableFood.Food LIKE ?)',[food_item], function (error, results, fields) {
	        // error will be an Error if one occurred during the query
	        // results will contain the results of the query
	        // fields will contain information about the returned results fields (if any)
	        console.log(fields);
	    });

	    res.render('searchitem', param);
	})

	return app;
}();