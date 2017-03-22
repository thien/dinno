var express = require('express');
var app     = express();
var Cookies = require("cookies");
var login   = require('../functions/login');
var db      = require('../functions/database');
var bf      = require('../functions/basefunctions');

app.locals.basedir = "." + '/views';

function getProfileInfo(userId) {
  return new Promise(function(resolve, reject) {
    db.query(`SELECT Firstname, Surname, Rating,
                     YEAR(CURRENT_TIMESTAMP) - YEAR(DOB) - (RIGHT(CURRENT_TIMESTAMP, 5) < RIGHT(DOB, 5)) as Age
              FROM User
              WHERE UserID = ?`, 
              [userId], 
              function (error, results, fields) {
                if (error) { 
                console.log(error); 
                reject();
              }
              else if (results.length == 0) {
                console.log('UserID not found');
                reject();
              }
              else {
                resolve(results[0]);
              }
    });
  });
}

function getUserMeals(userId) {
  return new Promise(function(resolve, reject) {
    db.query(`SELECT MealID, Name, Description
              FROM Meal
              WHERE UserID = ?`, 
              [userId], 
              function (error, results, fields) {
                if (error) { 
                  console.log(error); 
                  reject();
                }
                else {
                  resolve(results);
                }
              });
  });
}

module.exports = function() {
  app.get('/profile', function(req, res) {

    login.checkLogin(req, res).then(function(result) {
      var cookies = new Cookies(req, res);

      var userId = req.query.id;
      if (!userId) { userId = cookies.get('id'); }
      
      var profileInfo = getProfileInfo(userId);
      var userMeals   = getUserMeals(userId);

      Promise.all([profileInfo, userMeals]).then(function(data){
        var review = {
          "pauline": "this is good lol"
        }

        var param = {
          name: `${data[0].Firstname} ${data[0].Surname}`,
          age: data[0].Age,
          userId: userId,
          profile_photo: "http://1.bp.blogspot.com/-c9_0_EBSqCg/UG_uaVO3K-I/AAAAAAAAD18/zY53ome7ZRw/s200/John+Cena+profile+pic",
          user_location: "London",
          rating: data[0].Rating,
          no_reviews: 17,
          reviews: review,
          fooditems: data[1]
        };

        res.render('profile', param);

      }, function(err) {
        res.render('frontpage');
      });
    }, function(err) {
      res.render('frontpage');
    });

  })
  return app;
}();