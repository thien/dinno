var express = require('express');
var Cookies = require("cookies");
var dateFormat = require('dateformat');
var request = require('request');
const db = require('../functions/database');
const MAPS_KEY = 'AIzaSyAnTlmvCsv7mHwE7yiFmHBEA7fzNENHq70';

function getLocationInformation(lat, lng) {
  return new Promise(function(resolve, reject) {
      var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}` ;
      request(url, function (error, resp, body) {
        if (error) {
          console.log(error);
          reject(error);
        }
        else {
          var res = JSON.parse(body).results[0].address_components.reduce(function(acc , x) {
            acc[x.types[0]] = x.long_name;
            return acc;
          }, {});
          console.log(res);
          resolve(res);
        }
      });
  });
}

function checkLocationExists(lat, lng) {
  return new Promise(function(resolve, reject) {
    db.query(`SELECT LocationID
              FROM Location
              WHERE Latitude BETWEEN ? AND ?
              AND Longitude BETWEEN ? AND ?`, 
            [lat - 0.001, lat + 0.001, lng - 0.001, lng + 0.001],
    function(error, results, fields) {
      if (error) {
        console.log(error);
        reject(error);
      } 
      else if (results.length == 0) {
        resolve(0);
      }
      else {
        console.log(results);
        resolve(results[0].LocationID);
      }
    });
  });
}

module.exports = {
  getLocationInformation: function(lat, lng) {
    return getLocationInformation(lat, lng);
  },

  addNewLocation: function(lat,lng) {
    return new Promise(function(resolve, reject) {
        checkLocationExists(lat, lng).then( function(locationId) {
          console.log(locationId);
          if (locationId == 0) {
            getLocationInformation(lat,lng).then( function(locData){
              var postcode = locData.postal_code;
              var houseNumber = locData.street_number || locData.premise;
              var street = locData.route;
              var town = locData.postcode || locData.neighborhood || locData.locality;
              var city = locData.administrative_area_level_2 || locData.locality;
              db.query(`INSERT INTO Location
                        VALUES (0, ?, ?, ?, ?, ?, 0, ?, ?)`, 
                      [postcode, houseNumber, street, town, city, lat, lng],
              function(error, results, fields) {
                if (error) {
                  console.log(error);
                  reject(error);
                } else {
                  console.log(`Added location ${locData.route}`);
                  resolve(results.insertId);
                }
              });
            }, function(err) {
              reject(err);
            });
          }
          else {
            resolve(locationId);
          }
        }, function(err) {
          reject(err);
        });
    });
  },

}