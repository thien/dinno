var socket = io();

var markers = {};

function initMap() {
    // get latitude and longitude from GET variables
    var coord_lat = parseFloat(GETVariable("lat")) || 54.7731;
    var coord_lng = parseFloat(GETVariable("lng")) || -1.57489;

    // load google maps with 
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: {lat: coord_lat, lng: coord_lng},
    });

    return map;
}

function updateMap(map, locations) {
    var newMarkers = {};

    locations.forEach(function(loc) {
        var markerId = loc.Latitude + loc.Name + loc.Longitude;

        if (!markers[markerId]) {
            var marker = new google.maps.Marker({
                position: {lat: loc.Latitude, lng: loc.Longitude},
                map: map,
                title: `${loc.HouseNoName} ${loc.Street}`,
            });

            newMarkers[markerId] = marker;
            delete markers[markerId];


            google.maps.event.addListener(marker, 'click', function(event) {
                var coordInfoWindow = new google.maps.InfoWindow({
                    content: `<div class='row'>
                                <div class='col-md-4'>
                                    <a href='/fooditem?id=${loc.MealID}''> 
                                        <img src='${loc.Image}' class='marker-image' style='padding-right:45px;'>  
                                    </a>
                                </div>
                                <div class='col-md-8'>
                                    <a href='/fooditem?id=${loc.MealID}''> 
                                        <h3> ${loc.Name} </h5>
                                    </a>
                                    <p> ${loc.Description} </p>
                                </div>
                            </div>`,
                    position: marker.position
                });
                coordInfoWindow.open(map);
            });
            console.log(`Added ${markerId}`);
        }
        else {
            newMarkers[markerId] = markers[markerId];
            delete markers[markerId];
        }
    });

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = newMarkers;
}


$(document).ready(function() {

    var coord_lat = parseFloat(GETVariable("lat"));
    var coord_lng = parseFloat(GETVariable("lng"));

    var map = initMap();

    socket.emit('join', {
        name: Cookies.get('id')
    });
    
    socket.on('mapUpdate', function(locations) {
        console.log(locations);
        updateMap(map, locations);
    });

    window.setInterval(function () {
        socket.emit('mapUpdate', {
            id: Cookies.get('id'),
            lat: coord_lat,
            lng: coord_lng,
        });
    }, 5000);
    

    
})