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

	app.get('/reviewreports', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			userID = result.UserID;
			
			var verified = getVerifiedReportList();
			var unverified = getUnverifiedReportList();
			var rejected = getRejectedReportList();
			
			Promise.all([verified,unverified,rejected]).then(function(data) {
				
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

	
	app.get('/verifyreport', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			var reportId = req.query.id
			var verify = null
			console.log("tetste")
			console.log("tetste2")
			verify = verifyReport(reportId);
			var recipient = getRecipientSenderId(reportId);
			
			Promise.all([verify,recipient]).then(function(data) {
				var recipientId = data[1].RecipientID;
				var senderId = data[1].SenderID;
				
				var currentTime = new Date();
				dateFormat(currentTime, "YYYY-MM-DD HH:MM:SS");
				var count = report.getReportCount(recipientId);
				var sendernotif = chat.saveMessage(result.UserID,senderId,"Your report id:"+reportId+" has been verified.",currentTime);
				
				Promise.all([count,sendernotif]).then(function(countresult) {
					
					console.log(countresult[0][0].reportCount)
					
					if (countresult[0][0].reportCount == 3){
						//After 3 reports give a warning
						
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
					else if (countresult[0].reportCount >= 5){
						
						//After 5 reports suspend the user
						
						var suspend = null
						suspend = admin.suspendUser(recipientId);
						items = admin.removeUserItems(recipientId);
			
						Promise.all([suspend,items]).then(function(data) {
				
							res.redirect('/reviewreports');
				
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

	app.get('/rejectreport', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			var reportId = req.query.id
			var reject = rejectReport(reportId);
				
			var recipient = getRecipientSenderId(reportId);
			
			Promise.all([reject,recipient]).then(function(data) {
				var senderId = data[1].SenderID;
				
				var currentTime = new Date();
				dateFormat(currentTime, "YYYY-MM-DD HH:MM:SS");
				var sendernotif = chat.saveMessage(result.UserID,senderId,"Your report id:"+reportId+" has been rejected.",currentTime);
				
				Promise.all([sendernotif]).then(function(countresult) {
				
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
	app.get('/manageusers', function(req, res) {
		var param = {
			loggedin: false,
		};
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			userID = result.UserID;
			
			var suspended = getSuspendedUserList();
			var notsuspended = getNotSuspendedUserList();
			
			Promise.all([suspended,notsuspended]).then(function(data) {
				
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
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			
			param.user_data = {
					userID: result.userID,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage,
					textSize: result.TextSize,
					colourScheme: result.ColourScheme,
					isAdmin: result.IsAdmin
				};
			
			var userId = req.query.id;
			var suspend = admin.suspendUser(userId);
			var items = admin.removeUserItems(userId);
			
			Promise.all([suspend,items]).then(function(data) {
				
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
		login.checkAdminLogin(req, res).then(function(result) {
			param.loggedin = true;
			
			param.user_data = {
					userID: result.userID,
					firstname: result.Firstname,
					surname: result.Surname,
					mugshot: result.ProfileImage,
					textSize: result.TextSize,
					colourScheme: result.ColourScheme,
					isAdmin: result.IsAdmin
				};
			
			var userId = req.query.id
			var unsuspend = admin.unsuspendUser(userId);
			var items = admin.reinstateUserItems(userId);
			
			Promise.all([unsuspend,items]).then(function(data) {
				
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