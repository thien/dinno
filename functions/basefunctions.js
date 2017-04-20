// functions to generate a random listing; for testing purposes.

module.exports.generateRandomListing = function(){
	var random = {
		"foodname": generateRandomFoodName(),
		"food_id": Math.round(Math.random()*1000),
		"user_id": Math.round(Math.random()*1000),
		"user_name": "Salad",
		"userimg": "https://unsplash.it/80,80/?random",
		"image": "https://unsplash.it/600,"+Math.round(Math.random()*1000)+"/?random",
		"urle": "/fooditem",
		"marker":{
			lat: 54.766866 + Math.random()/10,
			lng: -1.5749834 + Math.random()/10
	    },
	    "description": generateRandomDescription(),
	    "best_before": new Date((Math.random()*(Date.now()-1188820475441))+1188800475441),
	    "last_updated": Math.round(Math.random()*10)
	}
	return random;
}

// private functions;
// these can only be accessed in this file.

function generateRandomFoodName(){
	var item = "";
	var fooditems = require("../data/random_food_list.json");
	item = fooditems.dishes[Math.floor(Math.random() * (fooditems.dishes.length))];
	return item;
}

function generateRandomDescription(){
	var subjects=['I','You','Bob','John','Sue','Kate','The lizard people'];
	var verbs=['will search for','will get','will find','attained','found','will start interacting with','will accept','accepted'];
	var objects=['Billy','an apple','a Triforce','the treasure','a sheet of paper'];
	var endings=['.',', right?','.',', like I said.','.',', just like your momma!'];

	var desc = subjects[Math.round(Math.random()*(subjects.length-1))]+' '+verbs[Math.round(Math.random()*(verbs.length-1))]+' '+objects[Math.round(Math.random()*(objects.length-1))]+endings[Math.round(Math.random()*(endings.length-1))];
	return desc;
}