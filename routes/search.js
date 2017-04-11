var db = require('../functions/database');
var bf = require('../functions/basefunctions');
var mysql = require('mysql')
var express = require('express');
var distance = require('google-distance');
var app = express();
var login = require('../functions/login');
var NodeGeocoder = require('node-geocoder');

var geocoderOptions = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    formatter: null // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(geocoderOptions);

app.locals.basedir = "." + '/views';

module.exports = function () {

    app.get('/search', function (req, res) {
        var param = {
            loggedin: false,
        };

        login.checkLogin(req, res).then(function (result) {
            param.loggedin = true;

            param.user_data = {
                userID: result.UserID,
                firstname: result.Firstname,
                surname: result.Surname,
                mugshot: result.ProfileImage
            };

            param.foodcheck = true;

            req.query.food = req.query.food || "";

            if (req.query.location && req.query.location !== "Locating Position...") {
                // get coords from search parameter

                geocoder.geocode(req.query.location, function (err, geo) {
                    param.location = req.query.location;
                    // console.log(geo);
                    console.log("allocating coords");
                    req.query.lat = geo[0].latitude;
                    req.query.lng = geo[0].longitude;
                    // console.log("got,", req.query.lat, "-", req.query.lng)
                    param.lat = req.query.lat;
                    param.lng = req.query.lng;
                    console.log("allocated coordinates.");
                    dealWithResults(req, res, param);
                });

            } else {
                // dude didn't type in a thang
                // default to durham when no position given.
                req.query.lat = 54.7731;
                req.query.lng = -1.57489;
                param.lat = req.query.lat;
                param.lng = req.query.lng;
                dealWithResults(req, res, param);
            }


        }, function (err) {
            param.error_message = {
                msg: "You're not logged in."
            };
            res.render('error', param);
        });

    })

    return app;
}();

function iterateDistance(req, results, i, callback) {
    if (i < results.length) {
        distance.get({
            origin: "" + req.query.lat + "," + req.query.lng,
            destination: "" + results[i].Latitude + "," + results[i].Longitude,
            units: 'imperial'
        }, function (err, distanceData) {
            if (err) return console.log(err);
            if (distanceData.distanceValue <= 1609 * req.query.radius) {
                results[i].BestBefore = results[i].BestBefore.toUTCString().substring(0, 17);
                data[data.length] = results[i]
                //console.log(distanceData)
            }
            iterateDistance(req, results, i + 1)
        })
    } else {
        //console.log(data)
        callback(data);
    }
}

function dealWithResults(req, res, param) {
    console.log("--------------------------------------------------------------------------------------")
    console.log(req.query);
    var query = `SELECT Meal.*, Location.*, User.ProfileImage, COUNT(Tag.TagID) AS MatchingTags  
									 FROM Meal 
									 JOIN User 
									 ON Meal.UserID = User.UserID
									 JOIN Location
									 ON Meal.LocationID = Location.LocationID
                                     LEFT JOIN TagMeal
                                     ON Meal.MealID = TagMeal.MealID
                                     LEFT JOIN Tag
                                     ON TagMeal.TagID = Tag.TagID
									 WHERE RecipientID IS NULL
                                     `
        ;


    if (req.query.radius == undefined || req.query.radius == "") {
        req.query.radius = 1
    }
    var latDif = req.query.radius / 69
    var longDif = req.query.radius / 69;
    distance.apiKey = 'AIzaSyCRkjhwstQA0YAqgmXH0-nmrO_hJ1m6pao';

    console.log(req.query.food != "");
    if (req.query.food != "") {
        query += ` AND MATCH(Meal.Name, Description) 
									 AGAINST(? IN BOOLEAN MODE)`;
    }
    if (req.query.meal == 'on' && req.query.ingredient == undefined) {
        query += " AND IsIngredient = 0"
    } else if (req.query.ingredient == 'on' && req.query.meal == undefined) {
        query += " AND IsIngredient = 1"
    }

    query += " AND Latitude BETWEEN " + (req.query.lat - latDif) + " AND " + (parseFloat(req.query.lat) + parseFloat(latDif))
    query += " AND Longitude BETWEEN " + (req.query.lng - longDif) + " AND " + (parseFloat(req.query.lng) + parseFloat(longDif))
    //query to find all tags containing
    var tags = []
    if (req.query.tags != undefined) {
        query += " AND ("
        tags = req.query.tags.split(",") || []
        for (var i = 0; i < tags.length; i++) {
            query += "`Tag`.`Name` = \"" + tags[i] + "\" OR "
        }
        query = query.substring(0, query.length - 4) + ")"
    }



    query += " GROUP BY Meal.MealID";
    query += " HAVING COUNT(Tag.TagID) >= " + tags.length
    query += ";"
    query = mysql.format(query, req.query.food)
    console.log(query);
    // will need to deal with queries
    db.query(query, req.query.food, function (error, results, fields) {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        if (error) {
            console.log(error);
            param.error_message = {
                msg: error
            };
            res.render('error', param);
        } else {
            var count = 0
            var i = 0
            data = []
            iterateDistance(req, results, 0, function (data) {
                console.log(data)
                var food_item_query = req.query.food;
                // Convert best before date to something readable
                // May need to change later -- Moved to within iterateDistance function - Simeon
                param.results = {
                    food: food_item_query,
                    fooditems: results
                }
                param.isSearchResultsPage = true;
                db.query("SELECT * FROM `Tag`", function (e, r, f) {
                    //console.log(r)
                    tag = []
                    for (var i = 0; i < r.length; i++) {
                        tag[i] = r[i].Name
                    }
                    //console.log(tag)
                    param.results.tags = tag
                    console.log(param)
                })
                res.render('searchitem', param);
            })
        }
    });
}