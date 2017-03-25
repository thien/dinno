

module.exports = function() {
	var express = require('express');
	var app = express();
	var login = require('../functions/login');
	app.locals.basedir = "." + '/views';

	app.get('/add', function(req, res) {
		var param = {
			loggedin: false,
		};

		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;

			param.user_data = {
				userID: result.UserID,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			res.render('new_fooditem', param);
		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})

	app.post('/add', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			param.user_data = {
				userID: result.UserID,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			var newItem = req.body;
			console.log(newItem);

			//
			//  This section is where you manipulate the data etc.
			//
			//

			//resulting item
			param.new_item = {
				name: "Hot dogs",
				image: "http://assets.epicurious.com/photos/5761c748ff66dde1456dfec0/2:1/w_1260%2Ch_630/crispy-baked-chicken-wings.jpg",
				id: 123
			}

			//render page with new entry
			res.render('added_fooditem', param);
		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})

	return app;
}();