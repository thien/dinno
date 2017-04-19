var express     = require('express');
var Cookies     = require("cookies");
var dateFormat  = require('dateformat');
const db        = require('../functions/database');
var chat = require('../functions/chat');
var dateFormat  = require('dateformat');

function getUserTags(userId) {
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Tag.TagID, Meal.Name
                  FROM Tag
				  JOIN TagMeal
				  ON TagMeal.TagID = Tag.TagID 
				  JOIN Meal
				  ON Meal.MealID = TagMeal.MealID 
                  WHERE Meal.UserID = ?`, 
                [userId], 
                function (error, results, fields) {
                  if (error) { 
                    console.log(error); 
                    reject();
                  }
                  else{
					console.log(results);
                    resolve(results);
                  }
                });
    });
  }


module.exports = {
  
  generateRandomRecommendation: function(userId) {
    return new Promise(function(resolve, reject) {
		
		getUserTags(userId).then(function(data) {
			
			var recommendationMsg = ""
			
			if (data.length == 0) {
				
				//Generate random default message
				var randRecId = Math.floor(Math.random() * 5)
				
				switch(randRecId) {
					case 0: //Generic Message 1
						recommendationMsg = "Food Waste Recommendation of the Day: When cooking, don't over-serve food. Who's going to finish all those big portions?";
						break;
					case 1: //Generic Message 2
						recommendationMsg = "Food Waste Recommendation of the Day: Remember to shop smart and only buy what you need, no naughty extras!";
						break;
					case 2: //Generic Message 3
						recommendationMsg = "Food Waste Recommendation of the Day: Try and keep track of sell by dates to see what needs to be eaten up on each day!";
						break;
					case 3: //Generic Message 4
						recommendationMsg = "Food Waste Recommendation of the Day: Try and eat as many left-overs as you can, don't be picky!";
						break;
					case 4: //Generic Message 5
						recommendationMsg = "Food Waste Recommendation of the Day: Try and split your meals with friends if you can't finish your food!";
						break;
					default: //Generic Message 6
						recommendationMsg = "Food Waste Recommendation of the Day: When cooking, try and incorporate extra stuff lying around the fridge into your meals.";
				}
				
            }
			else{
				
				var randTagId = Math.floor(Math.random() * data.length)
			
				switch(data[randTagId].TagID) {
					case 1: //Poultry
						recommendationMsg = "Food Waste Recommendation of the Day: We noticed you have been giving away some poultry items (" + data[randTagId].Name + ") on Dinno. Remember you can always give away expired meat to farmers to feed their animals!";
						break;
					case 2: //Vegetarian
						recommendationMsg = "Food Waste Recommendation of the Day: We noticed you have been giving away some vegetarian items (" + data[randTagId].Name + ") on Dinno. In order to reduce your veg wastage, did you know you can keep your vegetable peelings in the freezer and then turn them into vegetable stock?";
						break;
					case 3: //Pescatarian
						recommendationMsg = "Food Waste Recommendation of the Day: We noticed you have been giving away some fish items (" + data[randTagId].Name + ") on Dinno. In order to reduce your fish wastage, did you know you can turn fish offcuts into pate?";
						break;
					case 4: //Gluten-Free
						recommendationMsg = "Food Waste Recommendation of the Day: We noticed you have been giving away some Gluten-Free items (" + data[randTagId].Name + ") on Dinno. In order to reduce your food wastage, Make sure pay attention to the ingredients of items in the store so you don't have to throw them out when you get home!";
						break;
					case 5: //Dairy-Free
						recommendationMsg = "Food Waste Recommendation of the Day: We noticed you have been giving away some Dairy-Free items (" + data[randTagId].Name + ") on Dinno. In order to reduce your food wastage, Make sure pay attention to the ingredients of items in the store so you don't have to throw them out when you get home!";
						break;
					case 6: //Nut-Free
						recommendationMsg = "Food Waste Recommendation of the Day: We noticed you have been giving away some Nut-Free items (" + data[randTagId].Name + ") on Dinno. In order to reduce your food wastage, Make sure pay attention to the ingredients of items in the store so you don't have to throw them out when you get home!";
						break;
					case 7: //Fruit
						recommendationMsg = "Food Waste Recommendation of the Day: We noticed you have been giving away some fruit items (" + data[randTagId].Name + ") on Dinno. In order to reduce your food wastage, did you know canning or pickling food can increase a fruit item's shelf life for months?";
						break;
					default:
						recommendationMsg = "Food Waste Recommendation of the Day: First In, First Out! When unpacking your shopping, move older products to the front of the fridge and put new products in the back. This means you'll use up the older stuff first before it expires!";
				}
				
			}
			
			var currentTime = new Date();
			dateFormat(currentTime, "YYYY-MM-DD HH:MM:SS");
			
			chat.saveMessage(1,userId,recommendationMsg,currentTime).then(function(chatdata) {
				
				resolve(chatdata);
							
			}, 
			function(err) {
				console.log(err); 
				reject();
			});
			
		}, 
		function(err) {
			console.log(err); 
			reject();
		});
		
    });
  }
  
  
  
}