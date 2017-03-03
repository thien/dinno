const express = require('express');
const app     = express();
const fs      = require('fs');
const db      = require('../functions/database');
const encrypt = require('../functions/encrypt');

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

function verifyPassword(p1,p2) {
	return validatePassword(p1) && p1 === p2;
}

function addNewUser(userData) {
	// TODO: get location properly
	//				validate dob
	var locationId   = 1;
	var firstname    = userData['forename'];
	var surname      = userData['surname'];
	var emailAddress = userData['email'];

	// Gets date of birth in YYYY/MM/DD format
	var year  = userData['year'];
	var month = userData['month'];
	var day   = userData['day'];
	var dob   = `${year}/${month}/${day}`;
	
	var password       = userData['password'];
	var passwordVerify = userData['vpassword'];

	if      (!validateFirstName(firstname))                 { return false; }
	else if (!validateSurname(surname))                     { return false; }
	else if (!validateEmail(emailAddress))                  { return false; }
	else if (!verifyPassword(password, passwordVerify))     { return false; }

	var encryptedPass = encrypt.hash(userData['password'], userData['email']);

	db.query(`INSERT INTO User (UserID, LocationID, Firstname, Surname, EmailAddress, DOB, EncryptedPass, Rating)
						VALUES (0, ?, ?, ?, ?, ?, ?, 5.0)`, 
						[locationId, firstname, surname, emailAddress, dob, encryptedPass], 
						function (error, results, fields) {
							if (error) { console.log(error); }
							else       { console.log(`Added user ${emailAddress}`); }
						});

	return true;
}

module.exports = function(){

	app.get('/register', function (req, res) {
	    res.render('register');
	})

	app.get('/verify', function (req, res) {
		console.log(req.query);
		param = {
			name: "John"
		}
	  res.render('verify_email', param);
	})

	app.post('/register', function (req, res) {
		// get results
		var checks = req.body;
		var verified = true;

		console.log(checks);

		var isValidUser = addNewUser(checks);
		// verify registration stuff here

		// you might want to send it to the database too.

		if (isValidUser){
			// proceed with sending details to database
			param = {
				name: checks.forename,
				hash: encrypt.hash(checks.password)
			}
			// send email with the goodies.
			res.render('verify_email', param);
			}
		else {
			// redirect to themselves to fix it up.
			console.log(`Rejected user ${userData['email']}`);
			delete checks.password;
			delete checks.vpassword;
			res.render('register', checks);
		}
	})

	return app;
}();
