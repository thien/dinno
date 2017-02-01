const express = require('express');
const app = express();
const fs = require('fs');
const db = require('../functions/database');
const encrypt = require('../functions/encrypt');
app.locals.basedir = "." + '/views';

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
