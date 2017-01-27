module.exports = function(){
	var express = require('express');
	var app = express();
	app.locals.basedir = "." + '/views';

	
	app.get('/profile', function (req, res) {
	    var review = {
	        pauline: "this is good lol"
	    }
	    var param = {
	        name: "John",
	        registered_date: "August 2014",
	        profile_photo: "http://1.bp.blogspot.com/-c9_0_EBSqCg/UG_uaVO3K-I/AAAAAAAAD18/zY53ome7ZRw/s200/John+Cena+profile+pic",
	        user_location: "London",
	        no_reviews: 17,
	        verified: true,
	        reviews: review
	    }
	    res.render('profile', param);
	})
	return app;
}();