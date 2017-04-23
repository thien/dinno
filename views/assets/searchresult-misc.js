if (fooditems.length === 0){
	document.getElementById('itemCountMsg').innerHTML = "<img src='/assets/dinnosaur/sad_dinno.svg' width='20%' ><br>No dinnos found.";
}
else {
	document.getElementById('itemCountMsg').innerHTML = fooditems.length+" dinnos found";
}