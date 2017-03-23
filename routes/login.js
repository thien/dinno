var express = require('express');
var app = express();
var Cookies = require("cookies");
const encrypt = require('../functions/encrypt');
const db = require('../functions/database');

function login(email, pass, remember, req, res) {
	db.query(`SELECT VerificationCode, EncryptedPass, UserID
						FROM User
						WHERE EmailAddress = ?`, [email],
	function(error, results, fields) {
		if (error) {
			console.log(error);
			var error_message = {
				msg: error
			};
			res.render('error', error_message);
		} 
		else if (results.length == 0) {
				console.log('Email not found');
				var error_message = {
					msg: 'Email address not found'
				};
				res.render('error', error_message);
		} 
		else {
			var verificationCode = results[0].VerificationCode;
			var theirHash = encrypt.hash(pass, verificationCode);
			var id = results[0].UserID;
			if (theirHash == results[0].EncryptedPass) {
				console.log(`Login legit`);
				setLoginCookie(id, remember, req, res);
			} 
			else {
				console.log(`Login bad`);	
				console.log(theirHash);
				console.log(results[0].EncryptedPass);
				var error_message = {
					msg: 'Login unsuccessful'
				};
				res.render('error', error_message);
			}
		}
	});
}

function setLoginCookie(id, remember, req, res) {
	var loginCode = encrypt.hash(id, req.connection.remoteAddress);
	db.query(`UPDATE User
						SET LoginCode = ?
						WHERE UserID = ?`, [loginCode, id],
	function(error, results, fields) {
		if (error) {
			console.log(error);
			var error_message = {
				msg: error
			};
			res.render('error', error_message);
		} 
		else if (results.length == 0) {
			console.log('User id not found');
			var error_message = {
				msg: 'User not found'
			};
			res.render('error', error_message);
		} 
		else {
			var cookies = new Cookies(req, res);
			if (remember) {
				cookies.set('loginCode', loginCode, {
					httpOnly: false
				});
				cookies.set('id', id, {
					httpOnly: false
				});
				console.log('cookies set with no expiry!');
			}
			else {
				cookies.set('loginCode', loginCode, {
					httpOnly: false,
					maxAge: 21600000,
				});
				cookies.set('id', id, {
					httpOnly: false,
					maxAge: 21600000,
				});
				console.log('cookies set with expiry!');
			}
			res.render('frontpage');
		}
	});
}

module.exports = function() {
	app.locals.basedir = "." + '/views';

	app.post('/login', function(req, res) {
		var email = req.body.user;
		var pass = req.body.pass;
		var remember = req.body.remember;
		console.log(remember);
		login(email, pass, remember, req, res);
	})

	return app;
}();