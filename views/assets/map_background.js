window.initMap = function() {
    // get latitude and longitude from GET variables
    var coord_lat = 54.7731 ;
    var coord_lng = -1.57489 ;

    // load google maps with 
    // console.log('hello');
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: {lat: coord_lat, lng: coord_lng},
    });

    return map;
}

