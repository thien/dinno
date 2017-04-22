var express     = require('express');
var Cookies     = require("cookies");
var dateFormat  = require('dateformat');
const db        = require('../functions/database');
	
module.exports = {

//Marks a user with a given userId as suspended in the database.
//Input: userId
//Output: null
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

//Marks all meals owned by a particular user as unavailable.
//Input: userId
//Output: null
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

//Marks all meals owned by a particular user as available.
//Input: userId
//Output: null
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

//Marks a user with a given userId as unsuspended in the database.
//Input: userId
//Output: null
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