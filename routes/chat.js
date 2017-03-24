var express = require('express');
var app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var login = require('../functions/login');
var chat = require('../functions/chat');
var Cookies = require("cookies");
app.locals.basedir = "." + '/views';


module.exports = function() {

	app.get('/chat', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;

			var cookies = new Cookies(req, res);
			var senderId = cookies.get('id');
			var recipientId = req.query.id;

			param.user_data = {
				userID: senderId,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			if (senderId && recipientId) {

				var recipientInfo = chat.getRecipientInfo(recipientId);
				var previousMessages = chat.getPreviousMessages(senderId, recipientId);

				Promise.all([recipientInfo, previousMessages]).then(function(data) {

					param.chat = {
						theirName: `${data[0].Firstname} ${data[0].Surname}`,
						profileImage: data[0].ProfileImage,
						theirId: recipientId,
						messages: data[1],
					};

					res.render('chat', param);

				}, function(err) {
					param.error_message = {
						msg: err
					};
					res.render('error', param);
				});
			} else {
				param.error_message = {
					msg: "Your sender or recipient has not been specified"
				};
				res.render('error', param);
			}
		}, function(err) {
			param.error_message = {
				msg: "You're not logged in."
			};
			res.render('error', param);
		});
	})

	return app;
}();