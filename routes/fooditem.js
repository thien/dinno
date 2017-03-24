var bf = require('../functions/basefunctions');
var express = require('express');
var app = express();
var login = require('../functions/login');
app.locals.basedir = "." + '/views';

module.exports = function() {

	app.get('/fooditem', function(req, res) {

		login.checkLogin(req, res).then(function(result) {
			var random = {
				"foodname": "Hot Dogs",
				"food_id": Math.round(Math.random() * 1000),
				"user_id": Math.round(Math.random() * 1000),
				"user_name": "Johnathan Cena",
				"user_rating": 4.9,
				"front_img": "http://farm3.static.flickr.com/2716/4127243489_dd1197097d.jpg",
				"carousel_img": [
					"http://farm3.static.flickr.com/2716/4127243489_dd1197097d.jpg",
					"http://farm3.static.flickr.com/2716/4127243489_dd1197097d.jpg",
					"http://farm3.static.flickr.com/2716/4127243489_dd1197097d.jpg",
					"http://farm3.static.flickr.com/2716/4127243489_dd1197097d.jpg"
				],
				"userimg": "https://unsplash.it/80,80/?random",
				"image": "https://unsplash.it/600," + Math.round(Math.random() * 1000) + "/?random",
				"urle": "/fooditem",
				"marker": {
					lat: 54.766866 + Math.random() / 100,
					lng: -1.5749834 + Math.random() / 100
				},
				"description": "This is a hot dog, I ran out of bread.",
				"last_updated": Math.round(Math.random() * 10),
				"tags": ["KFC", "Chicken", "BBQ", "Hot Food"]
			}

			res.render('fooditem', random);
		}, function(err) {
			var error_message = {
				msg:"You're not logged in."
			};
			res.render('error', error_message);
		});

	})

	return app;
}();