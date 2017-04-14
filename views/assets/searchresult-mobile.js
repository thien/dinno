var addEvent = function(object, type, callback) {
    if (object == null || typeof(object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on"+type] = callback;
    }
};

addEvent(window, "resize", mobileResultsViewHandler);

var LHSContainer = document.getElementById('results_container_left');
var RHSContainer = document.getElementById('results_container_right');
var mobileSearchContainer = document.getElementById('mobile_details_handler');
var searchOptionsContainer = document.getElementById('search_item_details');
var mobileResultsToggleButton = document.getElementById('mobile-display-results-toggle');

window.onload = function(e){ 
    mobileResultsViewHandler();
    mobileSearchContainer.innerHTML = searchOptionsContainer.innerHTML;
}

function mobileResultsViewHandler(){
	if (window.innerWidth <= 420){
		showMobileAssets();
	} else {
		hideMobileAssets();
	}
}

function showMobileAssets(){
	LHSContainer.classList.remove("col-6");
	RHSContainer.classList.remove("col-6");
	LHSContainer.style.display = "none";
	mobileSearchContainer.style.display = "initial";
	mobileResultsToggleButton.style.visibility = "visible";
	searchOptionsContainer.style.visibility = "hidden";
}

function hideMobileAssets(){
	LHSContainer.style.display = "initial"; 
	RHSContainer.style.display = "initial";

	mobileResultsToggleButton.style.display = "none";
	mobileSearchContainer.style.display = "none";
	mobileResultsToggleButton.style.visibility = "hidden";
	searchOptionsContainer.style.visibility = "visible";

	if (LHSContainer.classList.contains("col-6") === false){
		LHSContainer.classList.add("col-6");
	}
	if (RHSContainer.classList.contains("col-6") === false){
		RHSContainer.classList.add("col-6");
	}
}

function toggleMobileResultsButton(){
	var iconList = '<i class="fa fa-th-list" aria-hidden="true"></i>';
	var iconMap = '<i class="fa fa-map-o" aria-hidden="true"></i>';

	if (mobileResultsToggleButton.value === "1"){
		// toggle back to list
		LHSContainer.style.display = "initial";
		RHSContainer.style.display = "none"; 
		mobileResultsToggleButton.value = '0';
		// mobileResultsToggleButton.innerHTML = iconMap;
		mobileResultsToggleButton.innerHTML = iconMap;
		console.log("dank");
	} else {
		// toggle back into map
		LHSContainer.style.display = "none";
		RHSContainer.style.display = "initial"; 
		mobileResultsToggleButton.value = '1';
		mobileResultsToggleButton.innerHTML = iconList;
		console.log("memes");
	}
}