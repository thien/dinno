var express = require('express');
var app = express();
var Cookies = require("cookies");
const encrypt = require('../functions/encrypt');
const db = require('../functions/database');
var recommendations = require('../functions/recommendations');

function login(email, pass, remember, req, res) {
	db.query(`SELECT VerificationCode, EncryptedPass, UserID, IsSuspended
						FROM User
						WHERE EmailAddress = ? AND IsVerified = 1`, [email],
	function(error, results, fields) {
		// Catch SQL errors
		if (error) {
			console.log(error);
			res.render('error', {msg: error});
		} 
		// If user not found in database
		else if (results.length == 0) {
			var msg = 'Email address not found!';
			console.log(msg)
			res.render('error', {msg: msg});
		} 
		else {
			// Check password hash matches
			var verificationCode = results[0].VerificationCode;
			var theirHash = encrypt.hash(pass, verificationCode);
			var id = results[0].UserID;
			if (theirHash == results[0].EncryptedPass && results[0].IsSuspended == 0) {
				// Send dinnobot reccomendation to user on successful login
				recommendations.generateRandomRecommendation(id).then(function(chatdata) {
					console.log(`Recommendation sent to ${id}!`);				
				}, 
				function(error) {
					console.log(error);
				});
				
				setLoginCookie(id, remember, req, res);
				console.log(`User ${id} logged in`);
			}
			// If user is flagged as suspended
			else if (results[0].IsSuspended == 1) {
				console.log(`Attempted login from suspended user ${id}`);	
				var msg ='You have been suspended from Dinno for breaching our terms of service. Please email mail@dinno.com for details.';
				res.render('error', {msg: msg});
			}
			else {
				console.log(`Failed login from ${id}`);	
				var msg = 'Incorrect Password!';
				res.render('error', {msg: msg});
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
		// Catch SQL error
		if (error) {
			console.log(error);
			res.render('error', {msg: error});
		} 
		else if (results.length == 0) {
			var msg = 'User not found'
			console.log(msg);
			res.render('error', {msg: msg});
		} 
		else {
			var cookies = new Cookies(req, res);
			// If user has selected 'remember me option' set cookies with no expiry
			if (remember) {
				cookies.set('loginCode', loginCode, {
					httpOnly: false
				});
				cookies.set('id', id, {
					httpOnly: false
				});
				console.log(`Cookies set with no expiry for ${id}!`);
			}
			// Otherwise set cookies with 6 hour expiry
			else {
				var SIX_HOURS = 21600000;
				cookies.set('loginCode', loginCode, {
					httpOnly: false,
					maxAge: SIX_HOURS,
				});
				cookies.set('id', id, {
					httpOnly: false,
					maxAge: SIX_HOURS,
				});
				console.log(`Cookies set with expiry for ${id}!`);
			}
			// Redirect to frontpage
			res.redirect('/');
		}
	});
}

module.exports = function() {
	app.locals.basedir = "." + '/views';

	app.post('/login', function(req, res) {
		var email = req.body.user;
		var pass = req.body.pass;
		// If user selected 'remember me' option
		var remember = req.body.remember;
		login(email, pass, remember, req, res);
	})

	app.get('/logout', function(req, res) {
		var cookies = new Cookies(req, res);
		// reset cookies
		cookies.set('loginCode', '');
		cookies.set('id', '');
		// redirect to frontpage
		res.redirect('/');
	})

	return app;
}();