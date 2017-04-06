var db = require('../functions/database');
var bf = require('../functions/basefunctions');
var mysql = require('mysql')
var express = require('express');
var distance = require('google-distance');
var app = express();
var login = require('../functions/login');

app.locals.basedir = "." + '/views';

module.exports = function() {

  app.get('/search', function(req, res) {
    var param = {
      loggedin: false,
    };

    login.checkLogin(req, res).then(function(result) {
      param.loggedin = true;

      param.user_data = {
        userID: result.UserID,
        firstname: result.Firstname,
        surname: result.Surname,
        mugshot: result.ProfileImage
      };

      console.log(req.query);
      var query = `SELECT Meal.*, Location.*, User.ProfileImage  
                   FROM Meal 
                   JOIN User 
                   ON Meal.UserID = User.UserID
                   JOIN Location
                   ON Meal.LocationID = Location.LocationID`;

      var latDif = 1 / 69
      var longDif = 1 / 69;
      distance.apiKey = 'AIzaSyCRkjhwstQA0YAqgmXH0-nmrO_hJ1m6pao';

      if(req.query.food != ""){
        query += ` WHERE(MATCH(Name, Description) 
                   AGAINST(? IN BOOLEAN MODE))
                   AND RecipientID IS NULL`;
        if (req.query.isMeal == 'true') {
          query += " AND `IsIngredient` = 0"
        } 
        else if(req.query.isMeal != 'both'){
          query += " AND `IsIngredient` = 1"
        }
      }

      query += " AND `Location`.`Latitude` BETWEEN " + (req.query.lat - latDif) + " AND " + (parseFloat(req.query.lat) + parseFloat(latDif))
      query += " AND `Location`.`Longitude` BETWEEN " + (req.query.lng - longDif) + " AND " + (parseFloat(req.query.lng) + parseFloat(longDif))
      query += ";"
      query = mysql.format(query, req.query.food)
      console.log(query);
      // will need to deal with queries
      db.query(query, req.query.food, function(error, results, fields) {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        if (error) {
          console.log(error);
          param.error_message = {
            msg: error
          };
          res.render('error', param);
        } 
        else {
          var count = 0
          var i = 0
          data = []
          iterateDistance(req, results, 0)
          var food_item_query = req.query.food;
          // Convert best before date to something readable
          // May need to change later
          results.forEach( function(x) {
            x.BestBefore = x.BestBefore.toUTCString().substring(0,17);
          });
          param.results = {
            food: food_item_query,
            fooditems: results
          }
          res.render('searchitem', param);
        }
      });

    }, function(err) {
      param.error_message = {
        msg: "You're not logged in."
      };
      res.render('error', param);
    });

  })

  function iterateDistance(req, results, i) {
    if (i < results.length) {
      distance.get({ origin: "" + req.query.lat + "," + req.query.lng, destination: "" + results[i].Latitude + "," + results[i].Longitude, units: 'imperial' }, function (err, distanceData) {
        if (err) return console.log(err);
        if (distanceData.distanceValue <= 1609 * req.query.radius) {
          data[data.length] = results[i]
        } 
        iterateDistance(req,results,i+1)
      })
    } else {
      console.log(data)
    }
  }

  return app;
}();