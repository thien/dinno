var express     = require('express');
var Cookies     = require("cookies");
var dateFormat  = require('dateformat');
const db        = require('../functions/database');
	
module.exports = {
suspendUser: function(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`UPDATE User
					SET IsSuspended = 1
					WHERE UserID = ?;`, 
							[userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject();
				} else {
					resolve(results);
				}
			});
	});
},

removeUserItems: function(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`UPDATE Meal
					SET IsAvailable = 0
					WHERE UserID = ?;`, 
							[userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject();
				} else {
					resolve(results);
				}
			});
	});
},

reinstateUserItems: function(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`UPDATE Meal
					SET IsAvailable = 1
					WHERE UserID = ?;`, 
							[userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject();
				} else {
					resolve(results);
				}
			});
	});
},

unsuspendUser: function(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`UPDATE User
					SET IsSuspended = 0
					WHERE UserID = ?;`, 
							[userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject();
				} else {
					resolve(results);
				}
			});
	});
}
	
	

}