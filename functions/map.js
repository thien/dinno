var express   = require('express');
var Cookies   = require("cookies");
const db      = require('../functions/database');

module.exports = {
  getLocations: function(bounds) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Meal.Name, Meal.MealID, Meal.Image, Meal.Description, Location.Latitude, Location.Longitude
                  FROM Meal
                  LEFT JOIN Location 
                  ON Meal.LocationID = Location.LocationID
                  WHERE Location.Longitude > ? AND Location.Longitude < ?
                  AND Location.Latitude > ? AND  Location.Latitude < ? 
                  AND Meal.RecipientID IS NULL AND Meal.IsAvailable
                  ORDER BY Location.Latitude, Location.Longitude`,
                  [bounds.west, bounds.east, bounds.south, bounds.north],
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject();
                  }
                  else{
                    var locations = {};
                    results.forEach(function(l) {
                      var latlng = `${l.Latitude}${l.Longitude}`;
                      if (!locations[latlng]) {
                        locations[latlng] = []; 
                      }
                      locations[latlng].push(l);
                    });
                    resolve(locations);
                  }
                });
    });
  },
}