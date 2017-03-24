const express = require('express');
const app = express();
const fs = require('fs');
const db = require('../functions/database');
const encrypt = require('../functions/encrypt');
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var Cookies = require("cookies");

app.locals.basedir = "." + '/views';

function validateFirstName(forename) {
	return forename.length > 0;
}

function validateSurname(surname) {
	return surname.length > 0;
}

function validateEmail(email) {
	var isValidEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return isValidEmail.test(email);
}

function validatePassword(pass) {
	var hasLetter = /^(.*[a-zA-Z].*)$/;
	var hasNumber = /^(.*[0-9].*)$/
	return pass.length >= 8 && hasLetter.test(pass) && hasNumber.test(pass);
}

function verifyPassword(p1, p2) {
	return validatePassword(p1) && p1 === p2;
}

function addNewUser(userData, res) {
	// TODO: get location properly
	//				validate dob
	var locationId = 1;
	var firstname = userData['forename'];
	var surname = userData['surname'];
	var emailAddress = userData['email'];
	var profileImage = userData['profileImage']

	// Gets date of birth in YYYY/MM/DD format
	var year = userData['year'];
	var month = userData['month'];
	var day = userData['day'];
	var dob = `${year}/${month}/${day}`;

	var password = userData['password'];
	var passwordVerify = userData['vpassword'];

	if (!validateFirstName(firstname)) {
		return false;
	} else if (!validateSurname(surname)) {
		return false;
	} else if (!validateEmail(emailAddress)) {
		return false;
	} else if (!verifyPassword(password, passwordVerify)) {
		return false;
	}

	var verificationCode = encrypt.hash(userData['password'], userData['email']);
	var encryptedPass = encrypt.hash(userData['password'], verificationCode);

	db.query(`INSERT INTO User (UserID, LocationID, Firstname, Surname, EmailAddress, DOB, EncryptedPass, IsVerified, VerificationCode, Rating, ProfileImage)
						VALUES (0, ?, ?, ?, ?, ?, ?, 0, ?, 5.0, ?)`, [locationId, firstname, surname, emailAddress, dob, encryptedPass, verificationCode, profileImage],
		function(error, results, fields) {
			if (error) {
				console.log(error);
				console.log(`Rejected user ${userData['email']}`);
				delete userData.password;
				delete userData.vpassword;
				res.render('register', userData);
			} else {
				console.log(`Added user ${emailAddress}`);
				sendVerificationEmail(emailAddress, verificationCode);
				param = {
					msg: `We've sent you an email, ${firstname}`,
				}
				res.render('verify_email', param);
			}
		});
	return true;
}


function updateUser(userId, userData, res) {
	// TODO: get location properly
	//				validate dob
	var locationId = 1;
	var firstname = userData['forename'];
	var surname = userData['surname'];
	var emailAddress = userData['email'];
	var profileImage = userData['profileImage']

	// Gets date of birth in YYYY/MM/DD format
	var year = userData['year'];
	var month = userData['month'];
	var day = userData['day'];
	var dob = `${year}/${month}/${day}`;

	var password = userData['password'];
	var passwordVerify = userData['vpassword'];

	if (!validateFirstName(firstname)) {
		return false;
	} else if (!validateSurname(surname)) {
		return false;
	} else if (!validateEmail(emailAddress)) {
		return false;
	} else if (!verifyPassword(password, passwordVerify)) {
		return false;
	}

	var verificationCode = encrypt.hash(userData['password'], userData['email']);
	var encryptedPass = encrypt.hash(userData['password'], verificationCode);

	db.query(`UPDATE User 
						SET LocationID = ?, Firstname = ?, Surname = ?, EmailAddress = ?, DOB = ?, EncryptedPass = ?, ProfileImage = ?
						WHERE UserID = ?`, [locationId, firstname, surname, emailAddress, dob, encryptedPass, profileImage, userId],
		function(error, results, fields) {
			if (error) {
				console.log(error);
				console.log(`Rejected user ${userData['email']}`);
				delete userData.password;
				delete userData.vpassword;
				res.render('register', userData);
			} else {
				console.log(`Updated user ${emailAddress}`);
				res.render('register', userData);
			}
		});
	return true;
}

function sendVerificationEmail(emailAddress, verificationCode) {
	var verificationUrl = `dinno.herokuapp.com/verify?code=${verificationCode}`;
	var request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: {
			personalizations: [{
				to: [{
					email: emailAddress,
				}, ],
				subject: 'Verify your account on Dinno!',
			}, ],
			from: {
				email: 'register@dinno.club',
			},
			content: [{
				type: 'text/html',
				value: `<a href='${verificationUrl}'>Click me!</a>`,
			}, ],
		},
	});

	//With callback
	sg.API(request, function(error, response) {
		if (error) {
			console.log('Error response received');
		} else {
			console.log(`Email sent to ${emailAddress}`);
		}
		console.log(response.statusCode);
		console.log(response.body);
		console.log(response.headers);
	});
}

function verifyUser(verificationCode, res) {
	db.query(`UPDATE User
						SET IsVerified = 1
						WHERE VerificationCode = ?`, [verificationCode],
		function(error, results, fields) {
			renderVerificationResults(verificationCode, error, results, res);
		});
}

function renderVerificationResults(verificationCode, error, results, res) {
	if (error) {
		console.log(error);
		param = {
			msg: error
		}
		res.render('verify_email', param);
	} else if (results.affectedRows == 0) {
		console.log(`Invalid verification code: ${verificationCode}`);
		param = {
			msg: "Your verification code isn't valid"
		}
		res.render('verify_email', param);
	} else {
		db.query(`SELECT Firstname
							FROM User
							WHERE VerificationCode = ?`, [verificationCode],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					param = {
						msg: error,
					}
					res.render('verify_email', param);
				} else {
					var name = results[0].Firstname;
					console.log(`User verified: ${name}`);
					param = {
						msg: `${name}, your email is now verified!`,
					}
					res.render('verify_email', param);
				}
			});
	}
}

module.exports = function() {

	app.get('/register', function(req, res) {
		res.render('register');
	})

	app.get('/verify', function(req, res) {
		var verificationCode = req.query.code;
		verifyUser(verificationCode, res);
	})

	app.post('/register', function(req, res) {
		// get results
		var userData = req.body;
		console.log(userData);

		var isValidUser = addNewUser(userData, res);

		if (!isValidUser) {
			console.log(`Rejected user ${userData['email']}`);
			delete userData.password;
			delete userData.vpassword;
			res.render('register', userData);
		}

	})

	app.post('/editprofile', function(req, res) {
		// get results
		var userData = req.body;
		userData.edit = true;

		var cookies = new Cookies(req, res);
		userId = cookies.get('id');

		var isValidUser = updateUser(userId, userData, res);

		if (!isValidUser) {
			console.log(`Rejected user ${userData['email']}`);
			delete userData.password;
			delete userData.vpassword;
			res.render('register', userData);
		}

	})

	return app;
}();