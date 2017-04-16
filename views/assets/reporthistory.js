/*

Client Side Management for /reporthistory

*/
var showingVerified = "Verified";


function FilterData() {
	var data;
	if (showingVerified == "Verified"){
		data = reportList.verified;
	} else {
		data = reportList.unverified;
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
	card += "<h4 class='card-title'>Reported By: "+item.Firstname+" "+item.Surname+"</h4>";
	card += "<p class='card-text'> <b>Reason:</b> " + item.Reason +"</p>";
	card += "<p class='card-text'> <b>Comments:</b> " + item.Comment +"</p>";
	card += "</div>";
	card += "<div class='card-footer text-muted'><p class='card-text'>ReportID: " + item.ReportID +"<span class='pull-right'>";
	if (item.IsVerified == 1){
		card += "Verified by Admin";
	}
	else{
		card += "This report is not verified";
	}
	card += "</span></p></div>";
	card += "</div></div></div></div>";

	return card;
}

$(document).ready(function(){
	console.log(reportList);
	console.log('testtestets');
	$('#showingVerified').change(function(){
		showingVerified = $('#showingVerified').val();
		FilterData();
	});
	FilterData();
});
