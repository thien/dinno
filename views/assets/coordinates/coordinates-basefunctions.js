function storeCoordinatesinCookies(latitude,longitude){
	Cookies.set('lat',latitude);
	Cookies.set('lng',longitude);
}
function setHTMLCoordResults(latitude, longitude){
	document.getElementById("lat").value = latitude;
	document.getElementById("lng").value = longitude;
}