var express = require('express');
var app = express();
var Cookies = require("cookies");
var login = require('../functions/login');
var report = require('../functions/report');
var admin = require('../functions/admin');
var db = require('../functions/database');
var bf = require('../functions/basefunctions');
var chat = require('../functions/chat');
var dateFormat  = require('dateformat');

app.locals.basedir = "." + '/views';

//Gets a list of ALL verified reports in the database.
//Input: null
//Output: Array of all verified reports in the database as well as the user data for both the recipient and sender.
function getVerifiedReportList() {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Report.ReportID, Report.SenderID, Report.RecipientID, Report.Reason, Report.Comment, Report.VerificationStatus, Sender.ProfileImage AS SenderProfileImage, Sender.Firstname AS SenderFirstname, Sender.Surname AS SenderSurname, Recipient.ProfileImage AS RecipientProfileImage, Recipient.Firstname AS RecipientFirstname, Recipient.Surname AS RecipientSurname
				  FROM Report
				  JOIN User Sender
				  ON Sender.UserID = Report.SenderID
				  JOIN User Recipient
				  ON Recipient.UserID = Report.RecipientID
				  WHERE Report.VerificationStatus = 1`,
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

//Gets a list of ALL unverified reports in the database.
//Input: null
//Output: Array of all unverified reports in the database as well as the user data for both the recipient and sender.
function getUnverifiedReportList() {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Report.ReportID, Report.SenderID, Report.RecipientID, Report.Reason, Report.Comment, Report.VerificationStatus, Sender.ProfileImage AS SenderProfileImage, Sender.Firstname AS SenderFirstname, Sender.Surname AS SenderSurname, Recipient.ProfileImage AS RecipientProfileImage, Recipient.Firstname AS RecipientFirstname, Recipient.Surname AS RecipientSurname
				  FROM Report
				  JOIN User Sender
				  ON Sender.UserID = Report.SenderID
				  JOIN User Recipient
				  ON Recipient.UserID = Report.RecipientID
				  WHERE Report.VerificationStatus = 0`,
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

//Gets a list of ALL rejected reports in the database (reports rejected/denied by an admin)
//Input: null
//Output: Array of all rejected reports in the database as well as the user data for both the recipient and sender.
function getRejectedReportList() {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Report.ReportID, Report.SenderID, Report.RecipientID, Report.Reason, Report.Comment, Report.VerificationStatus, Sender.ProfileImage AS SenderProfileImage, Sender.Firstname AS SenderFirstname, Sender.Surname AS SenderSurname, Recipient.ProfileImage AS RecipientProfileImage, Recipient.Firstname AS RecipientFirstname, Recipient.Surname AS RecipientSurname
				  FROM Report
				  JOIN User Sender
				  ON Sender.UserID = Report.SenderID
				  JOIN User Recipient
				  ON Recipient.UserID = Report.RecipientID
				  WHERE Report.VerificationStatus = 2`,
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

//Gets a list of ALL users in the database where IsSuspended = 1 (true)
//Input: null
//Output: Array of all suspended users in the database.
function getSuspendedUserList() {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT User.UserID, User.ProfileImage, User.Firstname, User.Surname, User.EmailAddress, User.IsAdmin, User.IsSuspended
				  FROM User
				  WHERE User.IsSuspended = 1`,
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

//Gets a list of ALL users in the database where IsSuspended = 0 (false)
//Input: null
//Output: Array of all non-suspended users in the database.
function getNotSuspendedUserList() {
	return new Promise(function(resolve, reject) {
		db.query(`SELECT User.UserID, User.ProfileImage, User.Firstname, User.Surname, User.EmailAddress, User.IsAdmin, User.IsSuspended
				  FROM User
				  WHERE User.IsSuspended = 0`,
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

//Changes the verification status of a report with a given reportId to 1 (verified)
//Input: reportId
//Output: null
function verifyReport(reportId) {
	return new Promise(function(resolve, reject) {
		db.query(`UPDATE Report
							SET VerificationStatus = 1
							WHERE ReportID = ?;`, 
							[reportId],
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

//Changes the verification status of a report with a given reportId to 2 (rejected)
//Input: reportId
//Output: null
function rejectReport(reportId) {
	return new Promise(function(resolve, reject) {
		db.query(`UPDATE Report
							SET VerificationStatus = 2
							WHERE ReportID = ?;`, 
							[reportId],
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

//Gets the recipient and sender id for a particular report.
//Input: reportId
//Output: Array containing RecipientID, SenderID
function getRecipientSenderId(reportId) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT RecipientID, SenderID
                  FROM Report
                  WHERE ReportId = ?`, 
                [reportId], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject(error);
                  }
                  else if (results.length == 0) {
                    console.log('Report not found');
                    console.log(results);
                    reject("Report not found");
                  }
                  else{
                    resolve(results[0]);
                  }
                });
    });
}

module.exports = function() {
	
	//When the review reports page is loaded (lists all reports with options to verify/reject reports)
	app.get('/reviewreports', function(req, res) {
		var param = {
			loggedin: false,
		};
		
		//Before loading the page check the user is logged in and is an admin, if not return an error.
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			userID = result.UserID;
			
			//Get lists of all verified, unverified and rejected reports.
			var verified = getVerifiedReportList();
			var unverified = getUnverifiedReportList();
			var rejected = getRejectedReportList();
			
			Promise.all([verified,unverified,rejected]).then(function(data) {
				
				//Read the lists as well as data on the cureent user into parameters and load the page.
				param.reportList = {};
				param.reportList.verified = data[0];
				param.reportList.unverified = data[1];
				param.reportList.rejected = data[2];
				
				param.user_data = {
					userID: userID,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage,
					textSize: result.TextSize,
					colourScheme: result.ColourScheme,
					isAdmin: result.IsAdmin
				};
				
				res.render('reviewreports', param);

			},function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
			});
		}, function(err) {
			param.error_message = {
				msg: "You need admin privileges to access this page."
			};
			res.render('error', param);
		});
	}),

	//When the 'verify' button is pressed for a particular report in the 'review reports' table.
	app.get('/verifyreport', function(req, res) {
		var param = {
			loggedin: false,
		};
		
		//Before loading the page check the user is logged in and is an admin, if not return an error.
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			
			//Get the reportId from the url (specified when redirected to this page)
			var reportId = req.query.id
			
			//Verify the report in the database and get the recipient and sender info for the report.
			var verify = verifyReport(reportId);
			var recipient = getRecipientSenderId(reportId);
			
			Promise.all([verify,recipient]).then(function(data) {
				var recipientId = data[1].RecipientID;
				var senderId = data[1].SenderID;
				
				//Get the current time and send a message to the sender of the report that their report has been verified.
				var currentTime = new Date();
				dateFormat(currentTime, "YYYY-MM-DD HH:MM:SS");
				var sendernotif = chat.saveMessage(result.UserID,senderId,"Your report (ID:"+reportId+") has been verified.",currentTime);
				console.log("verification confirmation sent to report sender")
				
				//Get the number of current reports filed against the recipient.
				var count = report.getReportCount(recipientId);
				
				Promise.all([count,sendernotif]).then(function(countresult) {
					
					console.log(countresult[0][0].reportCount)
					
					
					if (countresult[0][0].reportCount == 3){
						//After 3 reports give a warning message
						
						chat.saveMessage(result.UserID,recipientId,"This is an automated warning. You have 3 verified reports against you. If you are reported 2 more times your account will be suspended.",currentTime).then(function(datadata) {
							
							res.redirect('/reviewreports');
							console.log("warning sent")
							
						}, 
						function(err) {
							param.error_message = {
							msg: err
							};
						res.render('error', param);
						});
						
					}
					else if (countresult[0][0].reportCount >= 5){
						//After 5 reports suspend the user.
						
						var suspend = null
						suspend = admin.suspendUser(recipientId);
						items = admin.removeUserItems(recipientId);
			
						Promise.all([suspend,items]).then(function(data) {
				
							res.redirect('/reviewreports');
							console.log("suspended user")
				
						},function(err) {
							param.error_message = {
								msg: err
							};
							res.render('error', param);
						});
						
					}
					else{
						console.log("no warning sent")
						res.redirect('/reviewreports');
					}
				}, 
				function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
				});
				
				

			},function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
			});
				
			
			
		}, function(err) {
			param.error_message = {
				msg: "You need admin privileges to access this page."
			};
			res.render('error', param);
		});
	}),
	
	//When the 'reject' button is pressed for a particular report in the 'review reports' table.
	app.get('/rejectreport', function(req, res) {
		var param = {
			loggedin: false,
		};
		
		//Before loading the page check the user is logged in and is an admin, if not return an error.
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			
			//Get the reportId from the url (specified when redirected to this page)
			var reportId = req.query.id
			
			//Reject the report in the database and get the recipient and sender info for the report.
			var reject = rejectReport(reportId);
			var recipient = getRecipientSenderId(reportId);
			
			Promise.all([reject,recipient]).then(function(data) {
				var senderId = data[1].SenderID;
				
				//Get the current time and send a message to the sender of the report that their report has been rejected.
				var currentTime = new Date();
				dateFormat(currentTime, "YYYY-MM-DD HH:MM:SS");
				var sendernotif = chat.saveMessage(result.UserID,senderId,"Your report id:"+reportId+" has been rejected.",currentTime);
				
				Promise.all([sendernotif]).then(function(countresult) {
					
					//Reload the review reports page.
					res.redirect('/reviewreports');
				
				},function(err) {
					param.error_message = {
						msg: err
					};
					res.render('error', param);
				});

			},function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
			});
				
			
		}, function(err) {
			param.error_message = {
				msg: "You need admin privileges to access this page."
			};
			res.render('error', param);
		});
	}),
	
	//For when the 'manage users' page is loaded.
	app.get('/manageusers', function(req, res) {
		var param = {
			loggedin: false,
		};
		
		//Before loading the page check the user is logged in and is an admin, if not return an error.
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			userID = result.UserID;
			
			
			//Get list of both suspended and not suspended users.
			var suspended = getSuspendedUserList();
			var notsuspended = getNotSuspendedUserList();
			
			Promise.all([suspended,notsuspended]).then(function(data) {
				
				//Read the lists as well as data on the cureent user into parameters and load the page.
				param.userList = {};
				param.userList.suspended = data[0];
				param.userList.notsuspended = data[1];
				
				param.user_data = {
					userID: userID,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage,
					textSize: result.TextSize,
					colourScheme: result.ColourScheme,
					isAdmin: result.IsAdmin
				};
				
				res.render('manageusers', param);

			},function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
			});
		}, function(err) {
			param.error_message = {
				msg: "You need admin privileges to access this page."
			};
			res.render('error', param);
		});
	}),
	app.get('/suspenduser', function(req, res) {
		var param = {
			loggedin: false,
		};
		
		//Before loading the page check the user is logged in and is an admin, if not return an error.
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			
			//Load data about the currently logged in user into a parameter.
			param.user_data = {
					userID: result.userID,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage,
					textSize: result.TextSize,
					colourScheme: result.ColourScheme,
					isAdmin: result.IsAdmin
				};
			
			//Get the userId of the user to be suspended from the url and mark them as suspended in the database.
			var userId = req.query.id;
			var suspend = admin.suspendUser(userId);
			
			//Mark all of the user's items as unavailable.
			var items = admin.removeUserItems(userId);
			
			Promise.all([suspend,items]).then(function(data) {
				
				//Reload the manage users page.
				res.redirect('/manageusers');
				
			},function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
			});
				
			
			
		}, function(err) {
			param.error_message = {
				msg: "You need admin privileges to access this page."
			};
			res.render('error', param);
		});
	}),
	
	app.get('/unsuspenduser', function(req, res) {
		var param = {
			loggedin: false,
		};
		
		//Before loading the page check the user is logged in and is an admin, if not return an error.
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			
			//Load data about the currently logged in user into a parameter.
			param.user_data = {
					userID: result.userID,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage,
					textSize: result.TextSize,
					colourScheme: result.ColourScheme,
					isAdmin: result.IsAdmin
				};
			
			//Get the userId of the user to be suspended from the url and mark them as unsuspended in the database.
			var userId = req.query.id
			var unsuspend = admin.unsuspendUser(userId);
			
			//Mark all of the user's items as available.
			var items = admin.reinstateUserItems(userId);
			
			Promise.all([unsuspend,items]).then(function(data) {
				
				//Reload the manage users page.
				res.redirect('/manageusers');
				
			},function(err) {
				param.error_message = {
					msg: err
				};
				res.render('error', param);
			});
				
			
			
		}, function(err) {
			param.error_message = {
				msg: "You need admin privileges to access this page."
			};
			res.render('error', param);
		});
	})
				
	return app;
}();