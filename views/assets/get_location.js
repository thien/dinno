window.onload = function(){
	document.getElementById("phatsearchlocation").value = "Locating Position...";
	navigator.geolocation.getCurrentPosition(coord_poach_success, coord_poach_error);
};

function coord_poach_success(position) {
	var latitude  = position.coords.latitude.toFixed(4).toString();
	var longitude = position.coords.longitude.toFixed(4).toString();

	var coords = latitude +","+ longitude
	console.log("gps coord:",coords);
	document.getElementById("phatsearchlocation").value = coords.toString()

	setHTMLCoordResults(latitude, longitude);
	storeCoordinatesinCookies(latitude,longitude);
	printEstLocation(coords);
}

function coord_poach_error() {
	$.getJSON('http://ipinfo.io', function(data){
		document.getElementById("phatsearchlocation").value = data.loc + " (Est.)";
		printEstLocation(data.loc);
		console.log("ran error, est");
		console.log("est location", data.loc);
		var res = data.loc.split(",");
		// console.log(res)
		var latitude = res[0];
		var longitude = res[1];
		// document.getElementById("lat").value = latitude;
		// document.getElementById("lng").value = longitude;
		// Cookies.set('lat',latitude);
		// Cookies.set('lng',longitude);
		setHTMLCoordResults(latitude, longitude);
		storeCoordinatesinCookies(latitude,longitude);
		// document.getElementById("latlngfield").value = data.loc;
	})
}

function printEstLocation(coord){
	$.getJSON('http://maps.google.com/maps/api/geocode/json?latlng=' + coord, function(data){
		console.log(data.results[2]);
		console.log(data.results[2].formatted_address);
		document.getElementById("phatsearchlocation").value = data.results[2].formatted_address;
	})
}