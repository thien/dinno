if (fooditems.length === 0){
	document.getElementById('itemCountMsg').innerHTML = "Theres no dinnos found.. 😢";
}
else {
	document.getElementById('itemCountMsg').innerHTML = "Theres "+fooditems.length+" dinnos found";
}