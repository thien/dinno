var express = require('express');
var app = express();
var login = require('../functions/login');
var db = require('../functions/database');
var Cookies = require("cookies");

function getBackgroundImage() {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Image FROM Meal
							ORDER BY RAND()
							LIMIT 20`,
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject(error);
				} else {
					var k = []
					for (var i in results){
						// console.log(i);
						// console.log(results[i].image)
						k.push(results[i].Image);
					}
					resolve(k);
				}
			});
	});
}

module.exports = function() {
	app.locals.basedir = "." + '/views';

	app.get('/', function(req, res) {
		var param = {
			loggedin: false,
		};

		getBackgroundImage().then(function(backgrounds) {
			// param.background = background;
			param.backgrounds = backgrounds;

			login.checkLogin(req, res).then(function(result) {
		
				param.loggedin = true;
				var cookies = new Cookies(req, res);
				userId = cookies.get('id');

				// var profileInfo = getProfileInfo(userId);

				param.user_data = {
					userID: userId,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage,
					textSize: result.TextSize,
					colourScheme: result.ColourScheme,
					isAdmin: result.IsAdmin
				};
				


				res.render('frontpage', param);

			}, function(err) {
				res.render('frontpage',param);
			});
		}, function(err) {
			res.render('frontpage',param);
		});

	})

	return app;
}();