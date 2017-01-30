window.onload = function(){
	document.getElementById("fuckinglocation").innerHTML = "Locating Position...";

	function success(position) {
		var latitude  = position.coords.latitude;
		var longitude = position.coords.longitude;

		var titties = position.coords.latitude.toFixed(4).toString() +","+  position.coords.longitude.toFixed(4).toString()
		console.log("gps coord:",titties);
		document.getElementById("fuckinglocation").innerHTML = titties.toString()


		document.getElementById("latlngfield").value = titties;
		printEstLocation(titties)
	}

	function printEstLocation(coord){
		$.getJSON('http://maps.google.com/maps/api/geocode/json?latlng=' + coord, function(data){
			console.log(data.results[2])
			console.log(data.results[2].formatted_address)
			document.getElementById("fuckinglocation").innerHTML = data.results[2].formatted_address
		})
	}

	function error() {
		$.getJSON('http://ipinfo.io', function(data){
			document.getElementById("fuckinglocation").innerHTML = data.loc + " (Est.)"
			printEstLocation(data.loc);
			document.getElementById("latlngfield").value = data.loc;
		})
	}

	navigator.geolocation.getCurrentPosition(success, error);
};