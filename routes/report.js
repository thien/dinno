const express = require('express');
const app = express();
const db = require('../functions/database');
var login = require('../functions/login');
var Cookies = require("cookies");

//Inserts a new report into the database from the report form data, directed at the user matching the recipientId, from the user matching the userId.
//Input: reportData, userId, recipientId
//Output: null
function addNewReport(reportData, userId, recipientId) {
	return new Promise(function(resolve, reject) {
		var reason = reportData['reason'];
		var comment = reportData['comment'];
		var verificationStatus = 0; //All are set to unverified initially - have to be verified by admins

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

//Get a list of all reports from the database against a particular user, where the VerificationStatus = 1 (The report is verified)
//Input: userId
//Output: Array of reports VerificationStatus = 1 and RecipientID = userId
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

//Get a list of all reports from the database against a particular user, where the VerificationStatus = 0 (The report is unverified)
//Input: userId
//Output: Array of reports VerificationStatus = 0 and RecipientID = userId
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

//Get details about the recipient of a particular potential report (for the 'Make report' page)
//Input: recipientId
//Output: Array of details about the user (Firstname, Surname, ProfileImage, IsSuspended, IsAdmin)
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
	
	//When the 'make reports' page is loaded.
	app.get('/report', function(req, res) {
		var param = {
			loggedin: false,
		};
		
		//Before loading the page check the user is logged in, if not return an error.
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			
			//Get the user id of the user that a report is being made against from the url parameters
			var recipientId = req.query.id || 1;
			
			//Get data about the currently logged in user.
			param.user_data = {
				userID: result.UserID,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
			};
			
			//Get data about the user that a report is being made against
			var recipientInfo = getRecipientInfo(recipientId);
			
			Promise.all([recipientInfo]).then(function(data) {
					
					//If the user that is being reported is an admin or suspended, then return an error.
					if (data[0].IsSuspended == 1 || data[0].IsAdmin == 1){
						
						param.error_message = {
							msg: "You cannot report suspended users or admins."
						};
						res.render('error', param);
						
					}
					else{
						
						//Read the recipient data into a parameter and load the page.
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
	
	//For when the 'reports history' page is loaded.
	app.get('/reporthistory', function(req, res) {
		var param = {
			loggedin: false,
		};
		//Before loading the page check the user is logged in, if not return an error.
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			userID = result.UserID;
			
			//Get lists of both unverified and verified reports.
			var verified = getVerifiedReportList(userID);
			var unverified = getUnverifiedReportList(userID);
			
			Promise.all([verified,unverified]).then(function(data) {
				
				//Read the lists & current user data into page parameters and load the page.
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
	
	//For when a report is submitted against a user.
	app.post('/report', function(req, res) {
		var param = {
			loggedin: false,
		};
		//Before loading the page check the user is logged in, if not return an error.
		login.checkLogin(req, res).then(function(result) {
			param.loggedin = true;
			
			//Get data about the currently logged in user.
			param.user_data = {
				userID: result.UserID,
				firstname: result.Firstname,
				surname: result.Surname,
				mugshot: result.ProfileImage,
				textSize: result.TextSize,
				colourScheme: result.ColourScheme,
				isAdmin: result.IsAdmin
			};
			
			//Get the form data from the page as well the recipient details from their id as found in the url.
			var reportData = req.body;
			var recipientId = req.query.id || 1;
			var recipientInfo = getRecipientInfo(recipientId);
			
			Promise.all([recipientInfo]).then(function(data) {
				
				//Read the recipient data into a parameter.
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
			
			//Add a new report to the database using the form data and recipient + current user id.
			addNewReport(reportData, result.UserID, recipientId).then(function(result) {	
				
				//Load details about the submitted report into a parameter and load the page.
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