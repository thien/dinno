var express   = require('express');
var Cookies   = require("cookies");
const db      = require('../functions/database');

module.exports = {
  getLocations: function(pos, radius) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Meal.Name, Location.Latitude, Location.Longitude, Location.HouseNoName, Location.Street
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