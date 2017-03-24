var express   = require('express');
var Cookies   = require("cookies");
const db      = require('../functions/database');

module.exports = {
  getLocations: function(pos, radius) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Meal.Name, Meal.MealID, Meal.Image, Meal.Description, Location.Latitude, Location.Longitude
                  FROM Meal
                  JOIN Location 
                  ON Meal.LocationID = Location.LocationID`, 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject();
                  }
                  else{
                    resolve(results);
                  }
                });
    });
  },
}