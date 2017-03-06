var db = require('../functions/database');
var bf = require('../functions/basefunctions');
var express = require('express');
var app = express();
var login = require('../functions/login');
app.locals.basedir = "." + '/views';

module.exports = function() {
    app.get('/profile', function(req, res) {

        login.checkLogin(req, res).then(function(result) {

          var review = {
                "pauline": "this is good lol"
            }

            var user_foods = [
                bf.generateRandomListing(),
                bf.generateRandomListing(),
                bf.generateRandomListing(),
                bf.generateRandomListing(),
                bf.generateRandomListing(),
                bf.generateRandomListing()
            ];

            var param = {
                name: "John",
                registered_date: "August 2014",
                profile_photo: "http://1.bp.blogspot.com/-c9_0_EBSqCg/UG_uaVO3K-I/AAAAAAAAD18/zY53ome7ZRw/s200/John+Cena+profile+pic",
                user_location: "London",
                no_reviews: 17,
                verified: true,
                reviews: review,
                fooditems: user_foods
            };

            res.render('profile', param);

        }, function(err) {
          res.render('frontpage');
        });

    })
    return app;
}();