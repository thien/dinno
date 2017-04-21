var sorted = [];
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
function writeCardHolder(sorted){
	var newContent = '';
	for(var i=0; i<sorted.length; i++){
		newContent += '<div class="col-md-6 col-lg-4"><a class="card" href="/fooditem?id='+sorted[i].MealID+'" id="fooditem_'+sorted[i].MealID+'">'+
		'<img class="card-img-top img-fluid" src="'+sorted[i].Image+'" alt="Card image cap">'+
        '<div class="card-profile-container"><img class="card-userprofile-img" src="'+sorted[i].ProfileImage+'" alt="Card image cap"></div>'+
        '<div class="card-block">'+
        '<h4 class="card-title">'+sorted[i].Name+'</h4>'+
        '<p class="card-text">'+sorted[i].Description+'</p>'+
        '<p class="card-text"><small class="text-muted">Best before '+sorted[i].BestBefore+'</small></p>'+
        '</div>'+
        '</a></div>'
	}
	document.getElementById("fooditem_results_card").innerHTML = newContent;
}


//restrict results by distance
function distanceRestriction(results, maxDistance){
	//do stuff
	maxDistance = maxDistance/111;	//do kilometers to degrees (positioning done in lat/log)
	var userLat = 54.78, userLng = -1.52;
	resultsInRadius = [];
	for(var i=0;i<results.length;i++){
		if(Math.sqrt(Math.pow(results[i].Latitude-userLat,2) + Math.pow(results[i].Longitude-userLng,2))){
			resultsInRadius.push(results[i]);
		}
	}
	return resultsInRadius;
}

// restrict results by best before
function bestBeforeRestriction(results, date){
	resultsInDate = [];
	var year = parseInt(date.split("-")[0]);
	var month = parseInt(date.split("-")[1]);
	var day = parseInt(date.split("-")[2]);
	console.log(year);
	console.log(month);
	console.log(day);
	console.log(new Date(year, month - 1, day, 0, 0, 0, 0));
	var chosenDate = (new Date(year, month - 1, day, 0, 0, 0, 0)).getTime();
	for(var i=0;i<results.length;i++){
		console.log(results[i].BestBefore);
		if(new Date(results[i].BestBefore).getTime()>chosenDate){
			resultsInDate.push(results[i]);
		}
	}
	return resultsInDate;
}

//restrict results by distance
function byNearest(results){
	var userLat = 54.78, userLng = -1.52;
	results.sort(function(a,b){
		var distanceA = Math.sqrt(Math.pow(a.Latitude-userLat,2) + Math.pow(a.Longitude-userLng,2)), distanceB = Math.sqrt(Math.pow(b.Latitude-userLat,2) + Math.pow(b.Longitude-userLng,2));
		return distanceB - distanceA;
	});
}

//constraint is category
function byCategory(results, category){
	//do stuff
	for(var i=0;i<results.length;i++){
		if(results[i].category == category){
			//add to div or whatever
		}
	}
};


//constraint is best before
function byBestBefore(results){
	//sorting by best before date
	results.sort(function(a,b){
		return Date.parse(b.BestBefore) - Date.parse(a.BestBefore);
	});
};

//constraint is alphabetical
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
	$('.filter').change( function() {
		var sorted = bestBeforeRestriction(fooditems.slice(), $('#bestBefore').val());
		switch($('#orderBy').val()) {
	    case "A-Z":
	      console.log("sort by alphabetical");
				alphabetical(sorted);
	      break;	
	    case "nearest":
				console.log("sort by nearest")
				byNearest(sorted);
	      break;	
	    case "freshest":
				console.log("sort freshest")
				byBestBefore(sorted)
	      break;	
		}
		writeCardHolder(sorted);
	});
});