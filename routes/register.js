const express = require('express');
const app     = express();
const fs      = require('fs');
const db      = require('../functions/database');
const encrypt = require('../functions/encrypt');

app.locals.basedir = "." + '/views';

function getMonthNumberFromName(name) {
	// If you can think of a nicer way, make my day 
	var months = {
      'January' : '01',
     'February' : '02',
        'March' : '03',
        'April' : '04',
          'May' : '05',
         'June' : '06',
         'July' : '07',
       'August' : '08',
    'September' : '09',
      'October' : '10',
     'November' : '11',
     'December' : '12',
	}
	return months[name];
}

function addNewUser(userData) {
	// TODO: get location properly
	// 			 actually validate things

	const SECRET_SALT = '4G1L3M80';

	var locationId   = 1;
	var firstname    = userData['forename'];
	var surname      = userData['surname'];
	var emailAddress = userData['email'];

	// Gets date of birth in YYYY/MM/DD format
	var year  = userData['year'];
	var month = getMonthNumberFromName(userData['month']);
	// Pads day with zero if necessary
	var day   = (userData['day'].length == 2) ? userData['day'] : '0' + userData['day'];
	var dob   = `${year}/${month}/${day}`;

	var encryptedPass = encrypt.hash(userData['password'] + SECRET_SALT);

	db.query(`INSERT INTO User (UserID, LocationID, Firstname, Surname, EmailAddress, DOB, EncryptedPass, Rating)
						VALUES (0, ?, ?, ?, ?, ?, ?, 5.0)`, 
						[locationId, firstname, surname, emailAddress, dob, encryptedPass], 
						function (error, results, fields) {
							if (error) { console.log(error);   }
							else       { console.log(`Added user ${emailAddress}`); }
						});
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

		addNewUser(checks);
		// verify registration stuff here

		// you might want to send it to the database too.

		if (verified){
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
			delete checks.password;
			delete checks.vpassword;
			res.render('register', checks);
		}
	})

	return app;
}();
