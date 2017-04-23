var LHSContainer = document.getElementById('results_container_left');
var RHSContainer = document.getElementById('results_container_right');
var mobileSearchContainer = document.getElementById('mobile_details_handler');
var itemDetailsContainer = document.getElementById('search_item_details');
var searchButtonContainer = document.getElementById('search_item_buttons');
var searchButtonContainerContent = searchButtonContainer.innerHTML;
var mobileResultsToggleButton = null;
var headNavContainer = document.getElementById('head-nav').innerHTML;
var optButton = document.getElementById('searchOptionsButton');
var filButton = document.getElementById('searchFiltersButton');

// boolean check to see current status
var mapToggleCheck = 1;

// icons for button
var iconList = '<i class="fa fa-th-list" aria-hidden="true"></i>';
var iconMap = '<i class="fa fa-map-o" aria-hidden="true"></i>';

window.onload = function(e){ 
    mobileSearchContainer.insertAdjacentHTML('beforeend', headNavContainer);
    mobileSearchContainer.insertAdjacentHTML('beforeend',searchButtonContainer.innerHTML);

    // add button to the mobileSearchContainer > searchButtonContainer;
    var togButton = '<button class="btn btn-secondary" id="mobile-display-results-toggle" type="button" data-toggle="button" onclick="toggleMobileResultsButton()" style="visibility: visible;">'+iconList+'</button>';
	mobileSearchContainer.insertAdjacentHTML('beforeend', togButton);
	// allocate variable for use on the rest of the page
	mobileResultsToggleButton = document.getElementById('mobile-display-results-toggle');

	// deal with gmaps rendering issue on mobile (half the map is grey)
	google.maps.event.trigger(map, "resize");

	mobileResultsViewHandler();
}

function mobileResultsViewHandler(){
	if (window.innerWidth <= 420){
		showMobileAssets();
		filButton.classList.add('btn-danger');

		if (mapToggleCheck === 0){
			// on map mode
			mobileShowMap();
		} else {
			mobileShowList();
		}

		// deal with gmaps rendering issue on mobile (half the map is grey)
		google.maps.event.trigger(map, "resize");
		map.setCenter(new google.maps.LatLng(search_location.latitude, search_location.longitude), 1);
		// map.setCenter(marker.getPosition());
	} 
	else if (window.innerWidth > 420 && window.innerWidth < 992) {
		manageTabletScreenAssets();
	} else {
		manageLargeScreenAssets();
	}
}

function showMobileAssets(){
	LHSContainer.classList.remove("col-6");
	RHSContainer.classList.remove("col-6");
	LHSContainer.style.display = "none";
	// empty the nav, you only need it in one place
	document.getElementById('head-nav').innerHTML = "";


	mobileSearchContainer.style.display = "initial";
	mobileSearchContainer.style.width = '90%';
	mobileSearchContainer.style.left = "5%";
	itemDetailsContainer.style.display = "none";

	mobileResultsToggleButton.style.display = "initial";

	// sets display results container to 100% height
	document.getElementById('dud_spacing').style.height = '160px';
	document.getElementById('list_results_container').style.maxHeight = '100%';
}


function manageTabletScreenAssets(){
	document.getElementById('list_results_container').style.maxHeight = 'calc(100vh - 54px)';


	LHSContainer.style.display = "initial"; 
	RHSContainer.style.display = "initial";
	mobileResultsToggleButton.style.display = "none";

	// mobileResultsToggleButton.style.display = "none";
	mobileSearchContainer.style.display = "initial";
	if (window.innerWidth < 769 && window.innerWidth >= 570 ){
		mobileSearchContainer.style.width = '95%';
		mobileSearchContainer.style.left = "2.5%";
		// put option buttons inline
		document.getElementById('dud_spacing').style.height = '110px';

	} else if (window.innerWidth < 570) {
		mobileSearchContainer.style.width = '95%';
		mobileSearchContainer.style.left = "2.5%";
		// put option buttons inline
		document.getElementById('dud_spacing').style.height = '200px';
	} 
	else {
		mobileSearchContainer.style.width = '45%';
		mobileSearchContainer.style.left = "2.5%";
		document.getElementById('dud_spacing').style.height = '180px';
		// put option buttons underneath
	}
	itemDetailsContainer.style.display = "none";
	document.getElementById('head-nav').innerHTML = "";


	if (LHSContainer.classList.contains("col-6") === false){
		LHSContainer.classList.add("col-6");
	}
	if (RHSContainer.classList.contains("col-6") === false){
		RHSContainer.classList.add("col-6");
	}
}

function manageLargeScreenAssets(){
	document.getElementById('dud_spacing').style.height = '200px';
	document.getElementById('list_results_container').style.maxHeight = '100%';
	// searchButtonContainer.innerHTML = searchButtonContainerContent;


	LHSContainer.style.display = "initial"; 
	RHSContainer.style.display = "initial";

	// mobileResultsToggleButton.style.display = "none";
	mobileSearchContainer.style.display = "none";
	itemDetailsContainer.style.display = "block";
	document.getElementById('head-nav').innerHTML = headNavContainer;

	if (LHSContainer.classList.contains("col-6") === false){
		LHSContainer.classList.add("col-6");
	}
	if (RHSContainer.classList.contains("col-6") === false){
		RHSContainer.classList.add("col-6");
	}
}

function mobileShowMap(){
	// toggle back into map
	LHSContainer.style.display = "none";
	RHSContainer.style.display = "initial"; 
	mobileResultsToggleButton.innerHTML = iconList;
}

function mobileShowList(){
	// toggle back to list
	LHSContainer.style.display = "initial";
	RHSContainer.style.display = "none"; 
	// mobileResultsToggleButton.innerHTML = iconMap;
	mobileResultsToggleButton.innerHTML = iconMap;
}

function toggleMobileResultsButton(){
	if (mapToggleCheck === 0){
		mapToggleCheck = 1;
		mobileShowList();
		console.log("dank");
	} else {
		mapToggleCheck = 0;
		mobileShowMap();
		console.log("memes");
	}
	google.maps.event.trigger(map, "resize");
}

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
