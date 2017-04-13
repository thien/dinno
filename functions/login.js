var express   = require('express');
var Cookies   = require("cookies");
const encrypt = require('../functions/encrypt');
const db      = require('../functions/database');


module.exports = {
  checkLogin: function(req, res) {
    return new Promise(function(resolve, reject) {

        var cookies = new Cookies(req, res);
        var loginCode = cookies.get('loginCode');
        var id = cookies.get('id');
        db.query(`SELECT LoginCode = ? AS isValidLogin, Firstname, Surname, ProfileImage, UserID, TextSize, ColourScheme
                  FROM User
                  WHERE UserID = ?`, 
                [loginCode, id], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject();
                  }
                  else if (results.length == 0) {
                    console.log('UserID not found');
                    reject('Not logged in');
                  }
                  else if (results[0].isValidLogin){
                    resolve(results[0]);
                  }
                  else{
                    reject('Not logged in');
                  }
                });
    });
  }
}