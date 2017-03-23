var express = require('express');
var app = express();
var Cookies = require("cookies");
var login = require('../functions/login');
var db = require('../functions/database');
var bf = require('../functions/basefunctions');

app.locals.basedir = "." + '/views';

function getProfileInfo(userId) {
  return new Promise(function(resolve, reject) {
    db.query(`SELECT *,
        YEAR(CURRENT_TIMESTAMP) - YEAR(DOB) - (RIGHT(CURRENT_TIMESTAMP, 5) < RIGHT(DOB, 5)) as Age
        FROM User
        WHERE UserID = ?`, [userId],
      function(error, results, fields) {
        if (error) {
          console.log(error);
          reject(error);
        } else if (results.length == 0) {
          console.log('UserID not found');
          reject('UserID not found');
        } else {
          resolve(results[0]);
        }
      });
  });
}

function getUserMeals(userId) {
  return new Promise(function(resolve, reject) {
    db.query(`SELECT MealID, Name, Description
          FROM Meal
          WHERE UserID = ?`, [userId],
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

module.exports = function() {
  app.get('/profile', function(req, res) {
    login.checkLogin(req, res).then(function(result) {
      var cookies = new Cookies(req, res);
      var userId = req.query.id;
      if (!userId) {
        userId = cookies.get('id');
      }

      var profileInfo = getProfileInfo(userId);
      var userMeals = getUserMeals(userId);

      Promise.all([profileInfo, userMeals]).then(function(data) {

        var param = {
          name: `${data[0].Firstname} ${data[0].Surname}`,
          age: data[0].Age,
          userId: userId,
          profile_photo: "http://1.bp.blogspot.com/-c9_0_EBSqCg/UG_uaVO3K-I/AAAAAAAAD18/zY53ome7ZRw/s200/John+Cena+profile+pic",
          user_location: "London",
          rating: data[0].Rating,
          no_reviews: 17,
          reviews: 'review',
          fooditems: data[1]
        };

        res.render('profile', param);

      }, function(err) {
        var error_message = {
          msg: err
        };
        res.render('error', error_message);
      });
    }, function(err) {
      var error_message = {
        msg: "You're not logged in."
      };
      res.render('error', error_message);
    });
  })

    app.get('/editprofile', function(req, res) {

    login.checkLogin(req, res).then(function(result) {
      var cookies = new Cookies(req, res);
      userId = cookies.get('id');
     
      var profileInfo = getProfileInfo(userId);

      Promise.all([profileInfo]).then(function(data) {
        
        var param = {
          forename: `${data[0].Firstname}`,
          surname: `${data[0].Surname}`,
          profile_photo: data[0].ProfileImage,
          email: data[0].EmailAddress,
        };

        res.render('register', param);

      }, function(err) {
        var error_message = {
          msg: err
        };
        res.render('error', error_message);
      });
    }, function(err) {
      var error_message = {
        msg: "You're not logged in."
      };
      res.render('error', error_message);
    });

  })
  return app;
}();