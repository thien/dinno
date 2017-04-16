const express = require('express');
const app = express();
const db = require('../functions/database');
var login = require('../functions/login');
var Cookies = require("cookies");

function addNewReport(reportData, userId, recipientId) {
	return new Promise(function(resolve, reject) {
		var reason = reportData['reason'];
		var comment = reportData['comment'];
		var verificationStatus = 0; //All are set to verified straight away right now - later when admins are added reports have to be verified by admins

		db.query(`INSERT INTO Report (ReportID, SenderID, RecipientID, Reason, Comment, VerificationStatus)
							VALUES (0, ?, ?, ?, ?, ?)`, 
						[userId, recipientId, reason, comment, verificationStatus],
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

function getVerifiedReportList(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Report.ReportID, Report.SenderID, Report.RecipientID, Report.Reason, Report.Comment, Report.VerificationStatus, User.ProfileImage, User.Firstname, User.Surname
				  FROM Report
				  JOIN User 
				  ON User.UserID = Report.SenderID
				  WHERE Report.RecipientID = ? AND Report.VerificationStatus = 1`, [userId],
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

function getUnverifiedReportList(userId) {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Report.ReportID, Report.SenderID, Report.RecipientID, Report.Reason, Report.Comment, Report.VerificationStatus, User.ProfileImage, User.Firstname, User.Surname
				  FROM Report
				  JOIN User 
				  ON User.UserID = Report.SenderID
				  WHERE Report.RecipientID = ? AND Report.VerificationStatus = 0`, [userId],
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

//Robbed from John
function getRecipientInfo(recipientId) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Firstname, Surname, ProfileImage, IsSuspended, IsAdmin
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
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
			};
			
			var recipientInfo = getRecipientInfo(recipientId);
			
			Promise.all([recipientInfo]).then(function(data) {
					
					if (data[0].IsSuspended == 1 || data[0].IsAdmin == 1){
						
						param.error_message = {
							msg: "You cannot report suspended users or admins."
						};
						res.render('error', param);
						
					}
					else{
					
						param.recipient_data = {
							name: `${data[0].Firstname} ${data[0].Surname}`,
							profileImage: data[0].ProfileImage,
							theirId: recipientId
						};
					
						res.render('report',param)
					}

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
	
	app.get('/reporthistory', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			userID = result.UserID;
			
			var verified = getVerifiedReportList(userID);
			var unverified = getUnverifiedReportList(userID);
			
			Promise.all([verified,unverified]).then(function(data) {
				
				param.reportList = {};
				param.reportList.verified = data[0];
				param.reportList.unverified = data[1];
				
				param.user_data = {
					userID: userID,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage,
					textSize: result.TextSize,
					colourScheme: result.ColourScheme,
					isAdmin: result.IsAdmin
				};
				
				res.render('reporthistory', param);

			},function(err) {
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
	}),
	
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
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
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