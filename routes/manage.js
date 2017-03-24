var express = require('express');
var app = express();
var Cookies = require("cookies");
var login = require('../functions/login');
var db = require('../functions/database');
var bf = require('../functions/basefunctions');

app.locals.basedir = "." + '/views';


/*

Note: For /manage

Feel free to argue against; since im not sure how best this should be implemented
but in /manage you'd be able to see dinnos that you've uploaded and dinnos that you
requested. This should work similarly to how the web FAQ summative works, so the JSON
of the user's data (dinnos the user uploaded and the dinnos users requested) would
be stored on client side; which means that data manipulation would also be client side
through javascript.

This is obviously a template; implementation is absent

- Thien

*/

module.exports = function() {

	app.get('/manage', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			var cookies = new Cookies(req, res);
			userId = cookies.get('id');

			// var profileInfo = getProfileInfo(userId);

			param.user_data = {
				userID: userId,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};


			res.render('manage', param);
		}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});
	})
	return app;
}();