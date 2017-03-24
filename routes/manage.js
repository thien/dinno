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

			param.fooditems = {}
			param.fooditems.theirs = [
				{
					name : "Dhicken Wing",
					id : 123,
					userID : 12,
					usersname : "Chuck",
					description: "what do you think fool",
					image : "http://piq.codeus.net/static/media/userpics/piq_182936_400x400.png",
					url : "/",
					tags : ["hot", "salsa"],
					date_added : "2017-01-01",
					date_expiry : "2017-01-31",
					active : false
				},
				{
					name : "Ahicken Wing",
					id : 123,
					userID : 12,
					usersname : "Harry",
					description: "what do you think fool",
					image : "http://piq.codeus.net/static/media/userpics/piq_182936_400x400.png",
					url : "/",
					tags : ["hot", "salsa"],
					date_added : "2017-01-03",
					date_expiry : "2017-01-28",
					active : true
				},
				{
					name : "Bhicken Wing",
					id : 123,
					userID : 12,
					usersname : "Dave",
					description: "what do you think fool",
					image : "http://piq.codeus.net/static/media/userpics/piq_182936_400x400.png",
					url : "/",
					tags : ["hot", "salsa"],
					date_added : "2017-01-02",
					date_expiry : "2017-01-29",
					active : true
				},
				{
					name : "Chicken Wing",
					id : 123,
					userID : 12,
					usersname : "Daniel",
					description: "what do you think fool",
					image : "http://piq.codeus.net/static/media/userpics/piq_182936_400x400.png",
					url : "/",
					tags : ["hot", "salsa"],
					date_added : "2017-01-11",
					date_expiry : "2017-01-30",
					active : false
				}
			]
			param.fooditems.yours = [
				{
					name : "Pasta Bake",
					id : 123,
					userID : userId,
					description: "what do you think fool",
					image : "http://piq.codeus.net/static/media/userpics/piq_182936_400x400.png",
					url : "/",
					tags : ["hot", "salsa"],
					date_added : "2017-01-11",
					date_expiry : "2017-01-18",
					active : true
				},
				{
					name : "Qasta Bake",
					id : 123,
					userID : userId,
					description: "what do you think fool",
					image : "http://piq.codeus.net/static/media/userpics/piq_182936_400x400.png",
					url : "/",
					tags : ["hot", "salsa"],
					date_added : "2017-01-11",
					date_expiry : "2017-02-28",
					active : true
				},
				{
					name : "Rasta Baked",
					id : 123,
					userID : userId,
					description: "what do you think fool",
					image : "http://piq.codeus.net/static/media/userpics/piq_182936_400x400.png",
					url : "/",
					tags : ["hot", "salsa"],
					date_added : "2017-01-11",
					date_expiry : "2017-03-28",
					active : false
				},
				{
					name : "Sasta Baked",
					id : 123,
					userID : userId,
					description: "what do you think fool",
					image : "http://piq.codeus.net/static/media/userpics/piq_182936_400x400.png",
					url : "/",
					tags : ["hot", "salsa"],
					date_added : "2017-01-11",
					date_expiry : "2017-04-28",
					active : false
				},
			]

			if (req.query.type){
				if (req.query.type === "others"){
					param.defaultToggle = false;
				} else {
					param.defaultToggle = true;
				}
			}

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