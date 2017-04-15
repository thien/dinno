/*

Client Side Management for /manageusers

*/
var showingSuspended = "notsuspended";


function FilterData() {
	var data;
	if (showingSuspended == "suspended"){
		data = userList.suspended;
	} else{
		data = userList.notsuspended;
	}

	displayReports(data);
}

function displayReports(data){
	var results = "";
	console.log(data);
	console.log('testtestets');
	for (var i in data){
		results += cardEntry(data[i]);
	}
	$("#itemdata").html(results);
}

function cardEntry(item){
	var card = "<div class='container-vp'><div class='card'><div class='row man-item-entry'><div class='col-md-12'>";
	card += "<div class='man-img-container man-block-left'><img src='"+item.ProfileImage+"' class='cardphoto'></div><div class='card-block item-details'>";
	card += "<h4 class='card-title'>"+item.Firstname+" "+item.Surname+"</h4>";
	card += "<p class='card-text'><b>Email:</b> " + item.EmailAddress +"</p>";
	if (item.IsAdmin == 1){
		card += "<p class='card-text'><b>Admin:</b> Yes</p>";
	}
	else{
		card += "<p class='card-text'> <b>Admin:</b> No</p>";
	}
	card += "</div>";
	card += "<div class='card-footer text-muted'><p class='card-text'>UserID: " + item.UserID +"<span class='pull-right'>";
	if (showingSuspended == "suspended"){
		card += "<a class='btn btn-link btn-sm' href='/profile?id="+item.UserID+"'>View Profile</a>";
		card += "<a class='btn btn-link btn-sm' href='/unsuspenduser?id="+item.UserID+"'>Unsuspend User</a>";
	} else {
		card += "<a class='btn btn-link btn-sm' href='/profile?id="+item.UserID+"'>View Profile</a>";
		card += "<a class='btn btn-link btn-sm' href='/suspenduser?id="+item.UserID+"'>Suspend User</a>";
	}
	card += "</span></p></div>";
	card += "</div></div></div></div>";

	return card;
}

$(document).ready(function(){
	console.log(userList);
	console.log('testtestets');
	$('#showingSuspended').change(function(){
		showingSuspended = $('#showingSuspended').val();
		FilterData();
	});
	FilterData();
});
