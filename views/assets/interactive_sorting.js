
// sorted results variable
var sortedResults = fooditems.slice();

// var fooditems = JSON.stringify(results.fooditems).replace(/<\//g, '<\\/')

/*
sorting methods:
 - best before
 - category(s)
 - distance
*/

//get some results from the database as a list of objects
//then as the constraints are clicked, produce lists of the things

//event trigger, when some constraint clicked


//rewrite the card holder div
function writeCardHolder(sortedResults){
	var newContent = '';
	for(var i=0; i<sortedResults.length; i++){
		newContent += '<div class="col-md-6 col-lg-4"><a class="card" href="/fooditem" id="fooditem_'+sortedResults[i].MealID+'">'+
		'<img class="card-img-top img-fluid" src="'+sortedResults[i].Image+'" alt="Card image cap">'+
        '<div class="card-profile-container"><img class="card-userprofile-img" src="'+sortedResults[i].ProfileImage+'" alt="Card image cap"></div>'+
        '<div class="card-block">'+
        '<h4 class="card-title">'+sortedResults[i].Name+'</h4>'+
        '<p class="card-text">'+sortedResults[i].Description+'</p>'+
        '<p class="card-text"><small class="text-muted">Best before '+sortedResults[i].BestBefore+'</small></p>'+
        '</div>'+
        '</a></div>'
	}
	document.getElementById("fooditem_results_card").innerHTML = newContent;
}


// restrict results by distance
function distanceRestriction(results, maxDistance){
	//do stuff
	maxDistance = maxDistance/111;	//do kilometers to degrees (positioning done in lat/log)
	var userLat = 54.78, userLng = -1.52;
	resultsInRadius = [];
	console.log(maxDistance)
	for(var i=0;i<results.length;i++){
		if(Math.sqrt(Math.pow(results[i].Latitude-userLat,2) + Math.pow(results[i].Longitude-userLng,2))){
			resultsInRadius.push(results[i]);
		}
	}
	return resultsInRadius;
}

// restrict results by best before
function bestBeforeRestriction(results, day, month, year){
	resultsInDate = [];
	var chosenDate = (new Date(year, month, day, 0, 0, 0, 0)).getTime();
	for(var i=0;i<results.length;i++){
		console.log(new Date(results[i].BestBefore).getTime());
		if(new Date(results[i].BestBefore).getTime()>chosenDate){
			console.log(results[i].BestBefore);
			resultsInDate.push(results[i]);
		}
	}
	return resultsInDate;
}

//order results by distance
function byNearest(results){
	var userLat = 54.78, userLng = -1.52;
	results.sort(function(a,b){
		var distanceA = Math.sqrt(Math.pow(a.Latitude-userLat,2) + Math.pow(a.Longitude-userLng,2)), distanceB = Math.sqrt(Math.pow(b.Latitude-userLat,2) + Math.pow(b.Longitude-userLng,2));
		return distanceB - distanceA;
	});
}

// order by best before
function byBestBefore(results){
	//sorting by best before date
	results.sort(function(a,b){
		return Date.parse(a.BestBefore) - Date.parse(b.BestBefore);
	});
};

// order alphabetically
function alphabetical(results){
	//sorting by best before date
	results.sort(function(a,b){
		var nameA = a.Name.toLowerCase(), nameB = b.Name.toLowerCase();
		if(nameA < nameB){
			return -1;
		}else if(nameA > nameB){
			return 1;
		}else{
			return 0;
		}
	});
};


$(document).ready(function(){
	$("#sort").click(function(){
		var altered = false;
		sortedResults = fooditems.slice();
		if(document.getElementById("maxDistance").value != ""){
			console.log("test max dis");
			sortedResults = distanceRestriction(sortedResults, document.getElementById("maxDistance").value);
			altered = true;
		}
		if(document.getElementById('bestBeforeDay').value != '' && document.getElementById('bestBeforeMonth').value != '' && document.getElementById('bestBeforeYear').value != ''){
			sortedResults = bestBeforeRestriction(sortedResults, document.getElementById('bestBeforeDay').value, document.getElementById('bestBeforeMonth').value, document.getElementById('bestBeforeYear').value);
			console.log(sortedResults);
			altered = true;
		}
		if(document.getElementById("A-Z").checked){
			console.log("by alphabetical");
			alphabetical(sortedResults);
			altered = true;
		}else if(document.getElementById("nearest").checked){
			console.log("by nearest")
			byNearest(sortedResults);
			altered = true;
			for (var i = fooditems.length - 1; i >= 0; i--) {
				console.log(fooditems[i].Name);
			}
		}else if(document.getElementById("nearest").checked){
			console.log("by nearest")
			byNearest(fooditems);
			for (var i = fooditems.length - 1; i >= 0; i--) {
				console.log(Math.sqrt(Math.pow(fooditems[i].Latitude-54.78,2) + Math.pow(fooditems[i].Longitude-(-1.52),2)));
			}
		}else if (document.getElementById("freshest").checked){
			console.log("freshest")
			byBestBefore(sortedResults)
			altered = true;
		}

		// if(document.getElementById("maxDistance").value != ""){
		// 	console.log("test max dis");
		// 	distanceRestriction(fooditems, document.getElementById("maxDistance").value);
		// }
		writeCardHolder(sortedResults);
	});
});