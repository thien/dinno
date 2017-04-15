/*

Client Side Management for /manage

*/
var isYours = "You";
var sortBy = "Recent";
var data;


function FilterData() {
	
	if (isYours == "Others"){
		data = fooditems.received;
	} else {
		data = fooditems.postedclaimed.concat(fooditems.postedunclaimed);
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
	card += "<div class='man-img-container man-block-left'><img class='cardphoto' src='"+item.Image+"'></div><div class='card-block item-details'>";
	card += "<h4 class='card-title'>"+item.Name+"</h4>";
	if (isYours === "Others"){
		card += "<h6 class='card-subtitle mb-2 text-muted'>Owned by "+item.Firstname+" "+item.Surname+"</h6>";
		card += "<h6 class='card-subtitle mb-2 text-muted'>Found At "+item.HouseNoName+", "+item.Street+", "+item.Town+"</h6>";
	}
	else if (item.Firstname){
		card += "<h6 class='card-subtitle mb-2 text-muted'>Claimed by "+item.Firstname+" "+item.Surname+"</h6>";
	}
	else{
		card += "<h6 class='card-subtitle mb-2 text-muted'>Unclaimed</h6>";
	}
	card += "<p class='card-text'>" + item.Description +"</p>";
	card += "<p class='card-text'> <b>Best before:</b> " + new Date(item.BestBefore).toUTCString().substring(0, 17); +"</p>";
	for (var i in item.tags){
		card += "<span class='badge categoriestags'>"+item.tags[i]+"</span>";
	}
	card += "</div></div></div>";
	card += "<div class='card-footer text-muted'><div class='btn-group'>";
	if (isYours === "Others"){
		card += "<a class='btn btn-link btn-sm' href='/chat?id="+item.UserID+"'>Message "+item.Firstname+"</a></div>";
		card += "<span><a class='btn btn-link btn-sm' href='/cancel?id="+item.MealID+"'>Cancel</a></span>";
	} else {
		if (item.Firstname){
			card += "<a class='btn btn-link btn-sm' href='/chat?id="+item.RecipientID+"'>Message "+item.Firstname+"</a></div>";
		}
		else{
			card += "<a class='btn btn-link btn-sm' href='/edit/"+item.MealID+"'>Edit</a>";
			card += "<a class='btn btn-link btn-sm' href='/remove?id="+item.MealID+"'>Remove</a></div>";
		}
	}
	console.log("rating:" + item.Rating)
	if (item.Rating != null || isYours == "Others") {
		//console.log(item.Rating)
		var classes = "rating"
		if (isYours == "Others" && item.Rating != null) {
			classes += " rated"
		}else if(isYours == "Others"){
			console.log(item.MealID)
			card += "<form id=mealID" + item.MealID + ">"
		}
		
		card += '<span><select class="' + classes + '">'

		for (var i = 1; i < 6; i++) {
			if (item.Rating == i) {
				card += "<option value=\"" + i + "\" selected>" + i + "</option>"
			} else {
				card += "<option value=\"" + i + "\">" + i + "</option>"
			}
		}
		card += '</select>'
		if (isYours == "Others" && item.Rating == null) {
			//console.log(user_data)
			card += "<button class='rating-button' type='button''>Rate!</button></form></span>"
		}
	}
	card += "</div></div></div>";

	return card;
}

$(document).ready(function(){
	console.log(fooditems);
	$('#isYours').change(function(){
		isYours = $('#isYours').val();
		FilterData();
		initRating();
	});
	$('#sortBy').change(function(){
		sortBy = $('#sortBy').val();
		FilterData();
		initRating();
	});
	FilterData();
	initRating();
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

function initRating() {
	$(".rated").barrating({
		theme: 'css-stars',
		readonly: true
	})
	$(".rating").barrating({
		theme: 'css-stars',
		readonly: (isYours != "Others")
	})
	$('.rating-button').on("click", function (e) {
		console.log($(this.form).attr("id"))
		var mealID = parseInt($(this.form).attr("id").substring(6))
		var rating = parseInt($(this.form).find(":selected").val())
		$(this.form).find("select").barrating("readonly",true)
		var button = this
		console.log("ID: " + mealID)
		console.log("Value: " + rating)
		$.post("/manage", { mealID: mealID, rating: rating }, function (response) {
			if (response.success) {
				console.log("Successfully rated")
				for (var i = 0; i < data.length; i++) {
					console.log(data[i].MealID)
					if (data[i].MealID == mealID) {
						data[i].Rating = rating
					}
				}
				$(button).remove()
			} else {
				console.log("Something went wrong...")
			}
		})
	})
}
