var express   = require('express');
var Cookies   = require("cookies");
const db      = require('../functions/database');

module.exports = {
  getSenderName: function(senderId) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Firstname
                  FROM User
                  WHERE UserID = ?`, 
                [senderId], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject();
                  }
                  else if (results.length == 0) {
                    console.log('UserID not found');
                    console.log(results);
                    reject();
                  }
                  else{
                    resolve(results[0].Firstname);
                  }
                });
    });
  },

  getRecipientName: function(recipientId) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Firstname, Surname
                  FROM User
                  WHERE UserID = ?`, 
                [recipientId], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject();
                  }
                  else if (results.length == 0) {
                    console.log('UserID not found');
                    console.log(results);
                    reject();
                  }
                  else{
                    var firstname = results[0].Firstname;
                    var lastname  = results[0].Surname;
                    resolve(`${firstname} ${lastname}`);
                  }
                });
    });
  }
}