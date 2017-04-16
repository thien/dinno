if (fooditems.length === 0){
	document.getElementById('itemCountMsg').innerHTML = "<img src='/assets/dinnosaur/sad_dinno.svg' width='20%' ><br>There's no dinnos found.";
}
else {
	document.getElementById('itemCountMsg').innerHTML = "Theres "+fooditems.length+" dinnos found";
}