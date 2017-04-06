
// sorted results variable
var sortedResults = fooditems.slice();

//rewrite the card holder div
function writeCardHolder(sortedResults){
	var newContent = '';
	for(var i=0; i<sortedResults.length; i++){
		newContent += '<div class="col-md-6 col-lg-4"><a class="card" href="/fooditem" id="fooditem_'+fooditems[i].food_id+'">'+
		'<img class="card-img-top img-fluid" src="https://unsplash.it/600,751/?random" alt="Card image cap">'+
        '<div class="card-profile-container"><img class="card-userprofile-img" src="https://unsplash.it/80,80/?random" alt="Card image cap"></div>'+
        '<div class="card-block">'+
        '<h4 class="card-title">'+sortedResults[i].foodname+'</h4>'+
        '<p class="card-text">'+sortedResults[i].description+'</p>'+
        '<p class="card-text"><small class="text-muted">Last updated 6 mins ago</small></p>'+
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
		console.log(Math.sqrt(Math.pow(results[i].marker.lat-userLat,2) + Math.pow(results[i].marker.lng-userLng,2)));
		if(Math.sqrt(Math.pow(results[i].marker.lat-userLat,2) + Math.pow(results[i].marker.lng-userLng,2))<maxDistance){
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
		if(new Date(results[i].best_before).getTime()>chosenDate){
			console.log(results[i].best_before);
			resultsInDate.push(results[i]);
		}
	}
	return resultsInDate;
}

//order results by distance
function byNearest(results){
	var userLat = 54.78, userLng = -1.52;
	results.sort(function(a,b){
		var distanceA = Math.sqrt(Math.pow(a.marker.lat-userLat,2) + Math.pow(a.marker.lng-userLng,2)), distanceB = Math.sqrt(Math.pow(b.marker.lat-userLat,2) + Math.pow(b.marker.lng-userLng,2));
		return distanceB - distanceA;
	});
}

// order by best before
function byBestBefore(results){
	//sorting by best before date
	results.sort(function(a,b){
		return Date.parse(a.best_before) - Date.parse(b.best_before);
	});
};

// order alphabetically
function alphabetical(results){
	//sorting by best before date
	results.sort(function(a,b){
		var nameA = a.foodname.toLowerCase(), nameB = b.foodname.toLowerCase();
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
		}else if(document.getElementById("newest").checked){
			console.log("by newest")
			altered = true;
		}else if (document.getElementById("freshest").checked){
			console.log("freshest")
			byBestBefore(sortedResults)
			altered = true;
		}
		if(true){
			writeCardHolder(sortedResults);
		}	
	});
});