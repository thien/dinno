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

				var recipientInfo = chat.getRecipientInfo(recipientId);
				var previousMessages = chat.getPreviousMessages(senderId, recipientId);

				Promise.all([recipientInfo, previousMessages]).then(function(data) {

					var param = {
						theirName: `${data[0].Firstname} ${data[0].Surname}`,
            profileImage: data[0].ProfileImage,
						messages: data[1],
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