var socket = io();

function updateSubmitButton() {
	// All 5 form inputs must be valid
	if ($(".valid-input").length == 8) {
		$("#submitter").prop("disabled", false);
	}
}

function updateValidity(input, isValid) {
	if (isValid) {
		$(input).removeClass("invalid-input").addClass("valid-input");
		updateSubmitButton();
	}
	else {
		$(input).removeClass("valid-input").addClass("invalid-input");
		$("#submitter").prop("disabled", true);
	}
}

function validateName() {
	var name = $("#name").val();
	if (name.length > 0) { 
		updateValidity("#name", true);
		return true;
	}
	else {
		updateValidity("#name", false);
		return false;
	}
}

function validateFoodtype() {
	var foodtype = $("#foodtype").val();
	if (foodtype == 'Meal' || foodtype == 'Ingredient') { 
		updateValidity("#foodtype", true);
		return true;
	}
	else {
		updateValidity("#foodtype", false);
		return false;
	}
}

function validateDescription() {
	var description = $("#description").val();
	if (description.length > 0) { 
		updateValidity("#description", true);
		return true;
	}
	else {
		updateValidity("#description", false);
		return false;
	}
}

function validateDate() {
	var day = $("#day").val();
	var month = $("#month").val();
	var year = $("#year").val();

	var date = new Date(year, month - 1, day);
	var now = new Date();

	if (date >= now){
		updateValidity(".date", true);
		return true;
	}
	else{
		updateValidity(".date", false);
		return false;
	}
}

function validateLocation() {
	var location = $("#location").val();
	if ($("#use-current-location").is(':checked')  && $("#secret-lat-input").val() && $("#secret-lat-input").val() ){
		updateValidity("#location", true);
	}
	else if (!$("#use-current-location").is(':checked')){
		$.ajax({
			dataType: "json",
			url: 'https://maps.googleapis.com/maps/api/geocode/json',
			data: {address: location, key: "AIzaSyCRkjhwstQA0YAqgmXH0-nmrO_hJ1m6pao"},
			success: function(data){
				var res = data.results;
				console.log(res);
				if (res.length > 0) {
					$('#secret-lat-input').val(res[0].geometry.location.lat);
					$('#secret-lng-input').val(res[0].geometry.location.lng);
					updateValidity("#location", true);
				}
				else {
					updateValidity("#location", false);
				}
			},
			error: function(err){
				updateValidity("#location", false);
			}
		});
	}
	else {
		updateValidity("#location", false);
	}
}

function validateImage() {
	var image = $("#secret-image-input").val();
	if (image.length > 0){
		updateValidity("#upload_img_container", true);
		return true;
	}
	else{
		updateValidity("#upload_img_container", false);
		return false;
	}
}

function notify(){
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        /*var options = {
                    body: "Welcome to Dinno!",
                    icon: "icon.jpg",
                    dir : "ltr"
                };
        var notification = new Notification("Dinno",options);*/
        //do nothing but we can send notifications!
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }

            if (permission === "granted") {
                var options = {
                    body: "Welcome to Dinno Notifications!",
                    icon: "icon.jpg",
                    dir : "ltr"
                };
                var notification = new Notification("Dinno",options);
            }
        });
    }
}

function foodNotification(notification_content){
	socket.emit('prompt_notification', {
    	userID: [9],
    	body: notification_content.body,
    	icon: 'foodicon.jpg',
    	dir: 'ltr'
	});

	if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        socket.on('new_food_notification', function(notification_content){
        	if (notification_content.userID[0] == Cookies.get('id')) {
        		var notification = new Notification('Dinno', notification_content);
        	}
		});
        //var notification = new Notification("Dinno",options);
        //do nothing but we can send notifications!
    }
}


$(document).ready(function(){
	$("#submitter").prop("disabled", true);
	$('#name').keyup(validateName);
	$('#foodtype').change(validateFoodtype);
	$('#description').keyup(validateDescription);
	$('#location').keyup(validateLocation);
	$('#use-current-location').change(validateLocation);
	$('.date').change(validateDate);
	$('#secret-image-input').change(validateImage);
	// initialise each form input
	$(".form-control").keyup();
	$(".form-control").change();
	$('.date').change();

	var new_food = "Cheese";

	console.log(Cookies.get('id'));

	var notification_content = {
        body: "Some new tasty "+new_food+" is now avaiable!",
        icon: "icon.jpg",
        dir : "ltr"
    }

	foodNotification(notification_content);
});