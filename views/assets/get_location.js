window.onload = function(){
	document.getElementById("location_text").innerHTML = "Locating Position...";

	function success(position) {
		var latitude  = position.coords.latitude.toFixed(4).toString();
		var longitude = position.coords.longitude.toFixed(4).toString();

		var coords = latitude +","+ longitude
		console.log("gps coord:",coords);
		document.getElementById("location_text").innerHTML = coords.toString()


		// document.getElementById("latlngfield").value = coords;
		document.getElementById("lat").value = latitude;
		document.getElementById("lng").value = longitude;
		printEstLocation(coords)
	}

	function printEstLocation(coord){
		$.getJSON('http://maps.google.com/maps/api/geocode/json?latlng=' + coord, function(data){
			console.log(data.results[2])
			console.log(data.results[2].formatted_address)
			document.getElementById("location_text").innerHTML = data.results[2].formatted_address
		})
	}

	function error() {
		$.getJSON('http://ipinfo.io', function(data){
			document.getElementById("location_text").innerHTML = data.loc + " (Est.)"
			printEstLocation(data.loc);
			console.log("ran error, est")
			console.log("est location", data.loc)
			var res = data.loc.split(",");
			// console.log(res)
			var latitude = res[0];
			var longitude = res[1];
			document.getElementById("lat").value = latitude;
			document.getElementById("lng").value = longitude;
			// document.getElementById("latlngfield").value = data.loc;
		})
	}

	navigator.geolocation.getCurrentPosition(success, error);
};