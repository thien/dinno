var express     = require('express');
var Cookies     = require("cookies");
var dateFormat  = require('dateformat');
const db        = require('../functions/database');

module.exports = {
	
//Counts all the verified reports against a user in the database.
//Input: userId
//Output: Integer representing the number of verified reports against the user.
 getReportCount: function(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT COUNT(*) AS reportCount 
				  FROM Report
				  WHERE Report.RecipientID = ? AND Report.VerificationStatus = 1`, [userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject();
				} else {
					console.log("got report count");
					resolve(results);
				}
			});
	});
}
}