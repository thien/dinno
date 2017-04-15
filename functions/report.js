var express     = require('express');
var Cookies     = require("cookies");
var dateFormat  = require('dateformat');
const db        = require('../functions/database');

module.exports = {
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