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
			var recipientId = req.query.id || 1;

			param.user_data = {
				userID: senderId,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
			};
			if (senderId) {

				var recipientInfo = chat.getRecipientInfo(recipientId);
				var previousMessages = chat.getPreviousMessages(senderId, recipientId);
				var previousConversations = chat.getPreviousConversations(senderId);

				Promise.all([recipientInfo, previousMessages, previousConversations]).then(function(data) {

					param.chat = {
						theirName: `${data[0].Firstname} ${data[0].Surname}`,
						profileImage: data[0].ProfileImage,
						isSuspended: data[0].IsSuspended,
						isAdmin: data[0].IsAdmin,
						theirId: recipientId,
						messages: data[1],
					};
				
					param.convos = data[2];

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
			param.alerts = {
				error : ["You'll need to log in in order to perform that action."]
			}
			res.render('login', param);
		});
	})

	return app;
}();