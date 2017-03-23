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
		login.checkLogin(req, res).then(function(result) {
			var cookies = new Cookies(req, res);
			var senderId = cookies.get('id');
			var recipientId = req.query.id;
			if (senderId && recipientId) {

				var recipientName = chat.getRecipientName(recipientId);
				var previousMessages = chat.getPreviousMessages(senderId, recipientId);

				Promise.all([recipientName, previousMessages]).then(function(data) {

					var name = data[0]
					var messages = data[1]
					var param = {
						theirName: name,
						messages: messages,
					};
					res.render('chat', param);

				}, function(err) {
					// theres an issue with the promises
					var error_message = {
						msg:"There's an issue with the promises."
					};
					res.render('error', error_message);
				});
			} else {
				// theres an issue with the ID's of recipient/senders
				var error_message = {
					msg:"theres an issue with the ID's of recipient/senders."
				};
				res.render('error', error_message);
			}
		}, function(err) {
			var error_message = {
				msg:"You're not logged in."
			};
			res.render('error', error_message);
		});
	})

	return app;
}();