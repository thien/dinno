const express = require('express');
const app = express();
const db = require('../functions/database');
var login = require('../functions/login');
var Cookies = require("cookies");

function addNewReport(reportData, userId, recipientId) {
	return new Promise(function(resolve, reject) {
		var reason = reportData['reason'];
		var comment = reportData['comment'];
		var isVerified = 1; //All are set to verified straight away right now - later when admins are added reports have to be verified by admins

		db.query(`INSERT INTO Report (ReportID, SenderID, RecipientID, Reason, Comment, IsVerified)
							VALUES (0, ?, ?, ?, ?, ?)`, 
						[userId, recipientId, reason, comment, isVerified],
		function(error, results, fields) {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				console.log(`Added report by ${userId} on user ${recipientId}`);
				resolve(results);
			}
		});
	});
}

//Robbed from John
function getRecipientInfo(recipientId) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Firstname, Surname, ProfileImage
                  FROM User
                  WHERE UserID = ?`, 
                [recipientId], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject(error);
                  }
                  else if (results.length == 0) {
                    console.log('UserID not found: getRecipientName');
                    console.log(results);
                    reject("User not found");
                  }
                  else{
                    resolve(results[0]);
                  }
                });
    });
}

module.exports = function() {
	var express = require('express');
	var app = express();
	var login = require('../functions/login');
	app.locals.basedir = "." + '/views';

	app.get('/report', function(req, res) {
		var param = {
			loggedin: false,
		};

		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			
			var recipientId = req.query.id || 1;
			
			param.user_data = {
				userID: result.UserID,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};
			
			var recipientInfo = getRecipientInfo(recipientId);
			
			Promise.all([recipientInfo]).then(function(data) {

					param.recipient_data = {
						name: `${data[0].Firstname} ${data[0].Surname}`,
						profileImage: data[0].ProfileImage,
						theirId: recipientId
					};
					
					res.render('report',param)

				}, function(err) {
					param.error_message = {
						msg: err
					};
					res.render('error', param);
			});

		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})
	
	
	app.post('/report', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			param.user_data = {
				userID: result.UserID,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage
			};

			var reportData = req.body;
			var recipientId = req.query.id || 1;
			var recipientInfo = getRecipientInfo(recipientId);
			
			Promise.all([recipientInfo]).then(function(data) {

				param.recipient_data = {
					name: `${data[0].Firstname} ${data[0].Surname}`,
					profileImage: data[0].ProfileImage,
					theirId: recipientId
				};

				}, function(err) {
					param.error_message = {
						msg: err
					};
					res.render('error', param);
			});
			
			addNewReport(reportData, result.UserID, recipientId).then(function(result) {	

				param.new_report = {
					name: param.recipient_data.name,
					recipientId: recipientId,
					reason: reportData.reason
				};
				
				console.log(param)
				
				res.render('submitted_report', param);


			}, function(err) {
					param.error_message = {
						msg: err
					};
					res.render('error', param);
			});

		}, function(err) {
			param.error_message = {
				msg: err
			};
			res.render('error', param);
		});
	})


	return app;
}();