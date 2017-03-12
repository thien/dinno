var searchResults = [];	//results object list, meals and ingredients

//search_results[potato_index] = {
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

var bb1 = Date.parse("09 Feb 2017 00:00:00");
var bb2 = Date.parse("14 Feb 2017 00:00:00");
var bb3 = Date.parse("16 Feb 2017 00:00:00");

//adding values for testing
searchResults.push({item_id: 748573, location_id: 639456, user_id: 987543, name: "Carrot", best_before: bb1, category: "vegetable", description:"orange vitamin sticks"});
searchResults.push({item_id: 734087, location_id: 684535, user_id: 997454, name: "Beef Joint", best_before: bb3, category: "meat", description:"Joint of beef"});
searchResults.push({item_id: 798753, location_id: 637457, user_id: 985425, name: "Tuna", best_before: bb2, category: "fish", description:"Common canned fish"});



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

/*
//constraint is distance
//var specifiedDistance = 5; //distance in kilometers
$('#sortConstraintDistance').click(distanceRestriction);


//constraint is category
//$('#sort_constraint_category').click(function(){
	//do stuff
	var selected_type = "fish"
	for(var i=0;i<search_results.length;i++){
		if(search_results[i].category == selected_type){
			//add to div or whatever
		}
	}
//})

//constraint is best before
$('#sort_constraint_bestbefore').click(function(){
	//do stuff
	//sorting by best before date
	search_results.sort(function(a,b){
		return a.best_before - b.best_before;
	})
})
*/

distanceRestriction(specifiedDistance);