var express   = require('express');
var app       = express();
var Cookies   = require("cookies");
const encrypt = require('../functions/encrypt');
const db      = require('../functions/database');

function login(email, pass, req, res) {
	db.query(`SELECT VerificationCode, EncryptedPass
						FROM User
						WHERE EmailAddress = ?`, 
						[email], 
						function (error, results, fields) {
							if (error) { 
								console.log(error); 
							}
							else {
								if (results.length == 0) {
									console.log('Email not found');
								}
								else {
									var verificationCode = results[0].VerificationCode;
									var theirHash = encrypt.hash(pass, verificationCode);
									if (theirHash == results[0].EncryptedPass) {
										console.log(`Login legit`);
										setLoginCookie(email, req, res);
									}
									else {
										console.log(`Login bad`);
					
									}
								}
								
							}
						});
}

function setLoginCookie(email, req, res) {
	var loginCode = encrypt.hash(email, req.connection.remoteAddress);
	db.query(`UPDATE User
						SET LoginCode = ?
						WHERE EmailAddress = ?`, 
						[loginCode, email], 
						function (error, results, fields) {
							if (error) { 
								console.log(error); 
							}
							else {
								if (results.length == 0) {
									console.log('Email not found');
								}
								else {
								var cookies = new Cookies(req, res);
								cookies.set('loginCode', loginCode);
								cookies.set('email', email);
								console.log('cookies set!');
								}
							}
							res.render('frontpage');
						});
}

module.exports = function(){
	app.locals.basedir = "." + '/views';

	// app.get('/login', function (req, res) {
	//     res.render('login');
	// })

	app.post('/login', function (req, res) {
	    var email = req.body.user;
	    var pass = req.body.pass;
			login(email, pass, req, res);
	})

	return app;
}();