module.exports = function() {
    var express = require('express');
    var app = express();
    app.locals.basedir = "." + '/views';


    app.get('/profile', function(req, res) {
        var review = {
            "pauline": "this is good lol"
        }

        var user_foods = [{
            "foodname": "ASd",
            "image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
            "urle": "#",
            "description": "asdf lol mofo james is a plop",
            "last_updated": "3"
        }, {
            "foodname": "ASd",
            "image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
            "urle": "#",
            "description": "asdf lol mofo mitchel can eat a poo",
            "last_updated": "3"
        }, {
            "foodname": "ASd",
            "image": "https://media-cdn.tripadvisor.com/media/photo-s/04/cd/bd/99/kfc.jpg",
            "urle": "#",
            "description": "asdf lol mofo",
            "last_updated": "3"
        }];

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
    })
    return app;
}();