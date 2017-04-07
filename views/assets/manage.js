/*

Client Side Management for /manage

*/
var isYours = true;
var sortBy = 'recent';


function FilterData() {
	var data;
	if (isYours == "Others"){
		data = fooditems.theirs;
	} else {
		data = fooditems.yours;
	}

	// sorting
	if (sortBy === "Recent"){
		data.sort(sort_added);
	}
	if (sortBy === "A-Z"){
		data.sort(function(a, b) {
		  return stringsComparison(a.Name, b.Name);
		})
	}
	if (sortBy === "Expiry"){
		data.sort(sort_expiry);
	}

	displayGoods(data);
}

function displayGoods(data){
	var results = "";
	console.log(data);
	for (var i in data){
		results += cardEntry(data[i]);
	}
	$("#itemdata").html(results);
}

function cardEntry(item){
// .container-vp
// 	.card
// 		.row
// 			.col-md-12
// 				img.h-100.block-left(src='https://placeholdit.imgix.net/~text?txtsize=38&txt=200%C3%97400&w=200&h=200')
// 				.card-block.item-details
// 					h4.card-title Hot dogs
// 					p.card-text
// 						| Something about Chicken!
// 					span.badge.categoriestags Hot
// 					span.badge.categoriestags Hot
// 					span.badge.categoriestags Hot
// 					span.badge.categoriestags Hot

// 		.card-footer.text-muted 
// 			.btn-group
// 					a.btn.btn-link.btn-sm(href='#') Chat
// 					a.btn.btn-link.btn-sm(href='#') Edit
// 					a.btn.btn-link.btn-sm(href='#') Delete
// 					a.btn.btn-link.btn-sm(href='#') Cancel
	var card = "<div class='container-vp'><div class='card'><div class='row man-item-entry'><div class='col-md-12'>";
	card += "<div class='man-img-container man-block-left'><img src='"+item.Image+"'></div><div class='card-block item-details'>";
	card += "<h4 class='card-title'>"+item.Name+"</h4>";
	// if (search_parameters.req_type === "others"){
	// 	card += "<h6 class='card-subtitle mb-2 text-muted'>Submitted by "+item.Firstname+"</h6>";
	// }
	card += "<p class='card-text'>" + item.Description +"</p>";
	for (var i in item.tags){
		card += "<span class='badge categoriestags'>"+item.tags[i]+"</span>";
	}
	card += "</div></div></div>";
	card += "<div class='card-footer text-muted'><div class='btn-group'>";
	if (isYours === "Others"){
		card += "<a class='btn btn-link btn-sm' href='/chat?id="+item.UserID+"'>Message</a>";
		card += "<a class='btn btn-link btn-sm' href='#'>Cancel</a>";
	} else {
		card += "<a class='btn btn-link btn-sm' href='/edit/"+item.MealID+"'>Edit</a>";
		card += "<a class='btn btn-link btn-sm' href='/remove?id="+item.MealID+"'>Remove</a>";
	}
	card += "</div></div></div></div>";

	return card;
}

$(document).ready(function(){
	console.log(fooditems);
	$('#isYours').change(function(){
		isYours = $('#isYours').val();
		FilterData();
	});
	$('#sortBy').change(function(){
		sortBy = $('#sortBy').val();
		FilterData();
	});
	FilterData();
});

/*
JSON Sorter Functions
*/

function sort_expiry(a, b) {
    return new Date(a.BestBefore).getTime() - new Date(b.BestBefore).getTime();
}

function sort_added(a, b) {
    return a.MealID - b.MealID;
}

function stringsComparison(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return (a < b) ? -1 : (a > b) ? 1 : 0;
}