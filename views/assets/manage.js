/*

Client Side Management for /manage

*/

var search_parameters = {
	req_type : "others",
	filter : "requested",
	sorting : "recent"
}

function toggleSearchItemRequestType(check){
	// if false, show the stuff they want
	// if true, show the stuff they added
	if (check == true){
		$( "#buttonsort_others" ).removeClass('btn-primary').addClass('btn-secondary');
		$( "#buttonsort_yours" ).removeClass('btn-secondary').addClass('btn-primary');
		$( "#entry_active" ).show();
		search_parameters.req_type = "yours";
	} else {
		$( "#buttonsort_yours" ).removeClass('btn-primary').addClass('btn-secondary');
		$( "#buttonsort_others" ).removeClass('btn-secondary').addClass('btn-primary');
		$( "#entry_active" ).hide();
		search_parameters.req_type = "others";
	}
	FilterData();
}

function toggleEntryType(input){
	// requested, active or history
	switch(input) {
		case "requested":
			// code block
			search_parameters.filter = "requested";
			$( "#entry_requested" ).addClass('active');
			$( "#entry_active" ).removeClass('active');
			$( "#entry_history" ).removeClass('active');
			break;
		case "active":
			// code block
			search_parameters.filter = "active";
			$( "#entry_active" ).addClass('active');
			$( "#entry_requested" ).removeClass('active');
			$( "#entry_history" ).removeClass('active');
			break;
		case "history":
			// code block
			search_parameters.filter = "history";
			$( "#entry_history" ).addClass('active');
			$( "#entry_requested" ).removeClass('active');
			$( "#entry_active" ).removeClass('active');
			break;
		default:
			// code block
	}
	FilterData();
}

function sortResults(input){
	// recent, alphabetical or by expiry
	switch(input) {
		case "recent":
			// code block
			search_parameters.sorting = "recent";
			$( "#sort_recent" ).addClass('active');
			$( "#sort_alphabetical" ).removeClass('active');
			$( "#sort_expiry" ).removeClass('active');
			break;
		case "alphabetical":
			// code block
			search_parameters.sorting = "alphabetical";
			$( "#sort_alphabetical" ).addClass('active');
			$( "#sort_recent" ).removeClass('active');
			$( "#sort_expiry" ).removeClass('active');
			break;
		case "expiry":
			// code block
			search_parameters.sorting = "expiry";
			$( "#sort_expiry" ).addClass('active');
			$( "#sort_recent" ).removeClass('active');
			$( "#sort_alphabetical" ).removeClass('active');
			break;
		default:
			// code block
	}
	FilterData();
}

function FilterData() {
	var data;
	if (search_parameters.req_type === "others"){
		data = fooditems.theirs;
	} else {
		data = fooditems.yours;
	}

	// filtering
	if (search_parameters.filter === "active"){
		data.filter(function (i,n){
	        return n.active===true;
	    });
	}
	if (search_parameters.filter === "history"){
		data.filter(function (i,n){
	        return n.active===false;
	    });
	}

	// sorting
	if (search_parameters.sorting === "recent"){
		data.sort(sort_added);
	}
	if (search_parameters.sorting === "alphabetical"){
		data.sort(function(a, b) {
		  return stringsComparison(a.name, b.name);
		})
	}
	if (search_parameters.sorting === "expiry"){
		data.sort(sort_expiry);
	}

	displayGoods(data);
}

function displayGoods(data){
	var results = "";
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
	var card = "<div class='container-vp'><div class='card'><div class='row'><div class='col-md-12'>";
	card += "<img src='"+item.image+"' class='block-left h-100'><div class='card-block item-details'>";
	card += "<h4 class='card-title'>"+item.name+"</h4>";
	if (search_parameters.req_type === "others"){
		card += "<h6 class='card-subtitle mb-2 text-muted'>Submitted by "+item.usersname+"</h6>";
	}
	card += "<p class='card-text'>" + item.description +"</p>";
	for (var i in item.tags){
		card += "<span class='badge categoriestags'>"+item.tags[i]+"</span>";
	}
	card += "</div></div></div>";
	card += "<div class='card-footer text-muted'><div class='btn-group'>";
	if (search_parameters.req_type === "others"){
		card += "<a class='btn btn-link btn-sm' href='/chat?id="+item.userID+"'>Message</a>";
		card += "<a class='btn btn-link btn-sm' href='#'>Cancel</a>";
	} else {
		card += "<a class='btn btn-link btn-sm' href='/edit/"+item.id+"'>Edit</a>";
		card += "<a class='btn btn-link btn-sm' href='#'>Remove</a>";
	}
	card += "</div></div></div></div>";

	return card;
}

$(document).ready(function(){
	toggleSearchItemRequestType(false);
	FilterData();
});

/*
JSON Sorter Functions
*/

function sort_expiry(a, b) {
    return new Date(a.date_expiry).getTime() - new Date(b.date_expiry).getTime();
}

function sort_added(a, b) {
    return new Date(a.date_added).getTime() - new Date(b.date_added).getTime();
}

function stringsComparison(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return (a < b) ? -1 : (a > b) ? 1 : 0;
}