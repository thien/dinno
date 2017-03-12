

var searchResults = [];	//results object list, meals and ingredients

//search_results[potato_index] = {
	//foodname
	//item_id: 028435,
	//location_id: 398572, 
	//user_id: 492758, 
	//name: "potato", 
	//best_before: 25/06/17, 
	//category: "vegetable", 
	//description: "fresh potato from my cupboard"
//}

/*
sorting methods:
 - best before
 - catergory(s)
 - distance
*/

//for(var i=0;i<10;i++){
//	console.log(new Date((Math.random()*(Date.now()-1188820475441))+1188800475441));
//}

//for(var i=0;i<search_results.length;i++){
//	console.log(search_results[i]);
//}

//get some results from the database as a list of objects
//then as the constraints are clicked, produce lists of the things

//event trigger, when some constraint clicked

var specifiedDistance = 32;


//restrict results by distance
function distanceRestriction(specifiedDistance){
	//do stuff
	console.log(specifiedDistance);

	for(var i=0;i<searchResults.length;i++){
		//if over distance add to items for user
	}
}

//constraint is category
function byCategory(){
	//do stuff
	var selected_type = "fish"
	for(var i=0;i<search_results.length;i++){
		if(search_results[i].category == selected_type){
			//add to div or whatever
		}
	}
})


//constraint is best before
$('#sort_constraint_bestbefore').click(function(){
	//sorting by best before date
	search_results.sort(function(a,b){
		return a.best_before - b.best_before;
	})
})


$(document).ready(function(){
	$("#sort").click(function(){
		alert("test");
	});
});
