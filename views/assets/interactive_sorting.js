

/*
sorting methods:
 - best before
 - category(s)
 - distance
*/

//get some results from the database as a list of objects
//then as the constraints are clicked, produce lists of the things

//event trigger, when some constraint clicked


//restrict results by distance
function distanceRestriction(results, maxDistance){
	//do stuff
	var userLat = 54.78, userLng = -1.52;
	resultsInRadius = [];
	for(var i=0;i<results.length;i++){
		if(Math.sqrt(Math.pow(results[i].marker.lat-userLat,2) + Math.pow(results[i].marker.lng-userLng,2))){
			resultsInRadius.add(results[i]);
		}
	}
	return resultsInRadius;
}

//restrict results by distance
function byNearest(results){
	var userLat = 54.78, userLng = -1.52;
	results.sort(function(a,b){
		var distanceA = Math.sqrt(Math.pow(a.marker.lat-userLat,2) + Math.pow(a.marker.lng-userLng,2)), distanceB = Math.sqrt(Math.pow(b.marker.lat-userLat,2) + Math.pow(b.marker.lng-userLng,2));
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
		return Date.parse(a.best_before) - Date.parse(b.best_before);
	});
};

//constraint is alphabetical
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
		if(document.getElementById("A-Z").checked){
			console.log("by alphabetical");
			alphabetical(fooditems);
			for (var i = fooditems.length - 1; i >= 0; i--) {
				console.log(fooditems[i].foodname);
			}
		}else if(document.getElementById("nearest").checked){
			console.log("by nearest")
			byNearest(fooditems);
			for (var i = fooditems.length - 1; i >= 0; i--) {
				console.log(Math.sqrt(Math.pow(fooditems[i].marker.lat-54.78,2) + Math.pow(fooditems[i].marker.lng-(-1.52),2)));
			}
		}else if(document.getElementById("newest").checked){
			console.log("by newest")
		}else if (document.getElementById("freshest").checked){
			console.log("freshest")
			byBestBefore(fooditems)
			for (var i=0; i<fooditems.length; i++) {
				console.log(fooditems[i].best_before);
			}
		}
		if(document.getElementById("maxDistance").value != ""){
			console.log("test max dis");
			distanceRestriction(fooditems, document.getElementById("maxDistance").value);
		}
	});
	console.log(fooditems[0])
});

