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
	var card = "<div id='item_"+item.MealID+"' class='container-vp'><div class='card'><div class='row man-item-entry'><div class='col-md-12'>";
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
	if (item.Rating != null || isYours == "Others") { //if item is rated or belongs to someone else(not yours), then add a set of stars for rating
		//console.log(item.Rating)
		if(isYours == "Others"){ //if item doesn't belong to user, then create a form so that they can rate meals
			card += "<form class='submitstars' id=mealID" + item.MealID + ">"
		} else {
			card += '<div class="theyratedthefood" >Reviewed! <i class="fa fa-check" aria-hidden="true"></i></div>';
		}
		//create star rating appearence
		card += '<select class="rating-stars">'

		for (var i = 1; i < 6; i++) {
			if (item.Rating == i) {
				card += "<option value=\"" + i + "\" selected>" + i + "</option>"
			} else {
				card += "<option value=\"" + i + "\">" + i + "</option>"
			}
		}
		card += '</select>'
		// if(isYours == "Others"){
		// 	if(item.Rating ==null){
		// 	//if item doesnt belong then complete the form with either rate or change rating according to whether it has been rated before
		// 		card += "<button class='rating-button' type='button''>Rate!</button></form>"
		// 	}else{
		// 		card += "<button class='rating-button' type='button''>Change rating!</button></form>"
		// 	}

		// }
		card += '<div class="yesisubmittedit" id="check_'+item.MealID+'" >Submitted, Thanks! <i class="fa fa-check" aria-hidden="true"></i></div>';
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


function popUpSubmitRating(){

}

function initRating() {
	$(".rating-stars").barrating({
		theme: 'css-stars',
		readonly: (isYours != "Others"), //initialise so rating are read only if item belongs to user, else can be changed if item belongs to someone else
		onSelect: function(value, text, event) {
		    if (typeof(event) !== 'undefined') {
				// rating was selected by a user
				// console.log(event.target);
				// submit the button!
				console.log(event);

				rating = value;
				mealID = event.target.offsetParent.parentElement.id.replace("item_", "");
		     	// console.log($('.rating-button').attr("id"))
				// var mealID = parseInt($('.rating-button').attr("id").substring(6)) //get mealid of clicked rate button
				// var rating = parseInt($('.rating-button').find(":selected").val()) //get value of rating
				// $('.rating-button').find("select").barrating("readonly",true) 		//change the value to a readonly value once button has been clicked
				// console.log("ID: " + mealID)
				// console.log("Value: " + rating)
				$.post("/manage", { mealID: mealID, rating: rating }, function (response) { //post rating and mealid to be updated in the database
					if (response.success) {
						console.log("Successfully rated")
						for (var i = 0; i < data.length; i++) {
							console.log(data[i].MealID)
							if (data[i].MealID == mealID) { //find mealid in local variable, then update it so it displays correct everytime
								data[i].Rating = rating
							}
							
							// display tick when done
							console.log(mealID);
							$("#check_"+mealID).css("display","inline")
							// $("a.br-selected.br-current").tooltip();

						}
					} else {
						console.log("Something went wrong...")
					}
				})

		    } else {
		      // rating was selected programmatically
		      // by calling `set` method
		    }
	  }


	})
	$('.rating-button').on("click", function (e) {
		console.log($(this.form).attr("id"))
		var mealID = parseInt($(this.form).attr("id").substring(6)) //get mealid of clicked rate button
		var rating = parseInt($(this.form).find(":selected").val()) //get value of rating
		$(this.form).find("select").barrating("readonly",true) 		//change the value to a readonly value once button has been clicked
		console.log("ID: " + mealID)
		console.log("Value: " + rating)
		$.post("/manage", { mealID: mealID, rating: rating }, function (response) { //post rating and mealid to be updated in the database
			if (response.success) {
				console.log("Successfully rated")
				for (var i = 0; i < data.length; i++) {
					console.log(data[i].MealID)
					if (data[i].MealID == mealID) { //find mealid in local variable, then update it so it displays correct everytime
						data[i].Rating = rating
					}
				}
			} else {
				console.log("Something went wrong...")
			}
		})
	})
}
