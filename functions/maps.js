var express   = require('express');
var Cookies   = require("cookies");
const db      = require('../functions/database');


module.exports = {
  getMarkers: function(lat, lng, maxDistance) {
    return new Promise(function(resolve, reject) {

        var loginCode = cookies.get('loginCode');
        var id = cookies.get('id');
        db.query(`SELECT LoginCode = ? AS isValidLogin  
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