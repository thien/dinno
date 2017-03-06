var express   = require('express');
var Cookies   = require("cookies");
const encrypt = require('../functions/encrypt');
const db      = require('../functions/database');


module.exports = {
  checkLogin: function(req, res) {
    return new Promise(function(resolve, reject) {

        var cookies = new Cookies(req, res);
        var loginCode = cookies.get('loginCode');
        var email = cookies.get('email');
        db.query(`SELECT LoginCode = ? AS isValidLogin  
                  FROM User
                  WHERE EmailAddress = ?`, 
                [loginCode, email], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject();
                  }
                  else if (results.length == 0) {
                    console.log('Email not found');
                    reject();
                  }
                  else if (results[0].isValidLogin){
                    resolve();
                  }
                  else{
                    reject();
                  }
                });
    });
  }
}