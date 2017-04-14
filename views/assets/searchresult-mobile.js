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
var itemDetailsContainer = document.getElementById('search_item_details');
var searchButtonContainer = document.getElementById('search_item_buttons');
var mobileResultsToggleButton = null;
var headNavContainer = document.getElementById('head-nav').innerHTML;


var optButton = document.getElementById('searchOptionsButton');
var filButton = document.getElementById('searchFiltersButton');

window.onload = function(e){ 
    mobileResultsViewHandler();
    mobileSearchContainer.insertAdjacentHTML('beforeend', headNavContainer);
    mobileSearchContainer.insertAdjacentHTML('beforeend',searchButtonContainer.innerHTML);

    // add button to the mobileSearchContainer > searchButtonContainer;
    var togButton = '<button class="btn btn-secondary" id="mobile-display-results-toggle" type="button" data-toggle="button" onclick="toggleMobileResultsButton()" value="1" style="visibility: visible;"><i class="fa fa-map-o" aria-hidden="true"></i></button>';
	mobileSearchContainer.insertAdjacentHTML('beforeend', togButton);
	// allocate variable for use on the rest of the page
	mobileResultsToggleButton = document.getElementById('mobile-display-results-toggle');
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
	itemDetailsContainer.style.visibility = "hidden";
	document.getElementById('head-nav').innerHTML = "";
	optButton.classList.remove('btn-primary');
	filButton.classList.remove('btn-primary');
	optButton.classList.add('btn-danger');
	filButton.classList.add('btn-danger');
}

function hideMobileAssets(){
	optButton.classList.add('btn-primary');
	filButton.classList.add('btn-primary');
	optButton.classList.remove('btn-danger');
	filButton.classList.remove('btn-danger');

	LHSContainer.style.display = "initial"; 
	RHSContainer.style.display = "initial";

	// mobileResultsToggleButton.style.display = "none";
	mobileSearchContainer.style.display = "none";
	itemDetailsContainer.style.visibility = "visible";
	document.getElementById('head-nav').innerHTML = headNavContainer;

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