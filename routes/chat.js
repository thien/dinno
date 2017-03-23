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
					var error_message = {
						msg: err
					};
					res.render('error', error_message);
				});
			} else {
				var error_message = {
					msg:"Your sender or recipient has not been specified"
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