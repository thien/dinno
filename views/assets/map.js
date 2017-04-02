var socket = io();

var markers = {};

function GETVariable(variable){
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == variable){
            return KeyValuePair[1];
        }
    }
}

window.initMap = function() {
    // get latitude and longitude from GET variables
    var coord_lat = parseFloat(GETVariable("lat")) || 54.7731;
    var coord_lng = parseFloat(GETVariable("lng")) || -1.57489;

    // load google maps with 
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: {lat: coord_lat, lng: coord_lng},
    }, function() {console.log('callback'); });

    console.log()
    console.log('bounds' + map.getBounds());
    socket.emit('mapUpdate', {
        id: Cookies.get('id'),
        bounds: map.getBounds(),
    });

     socket.emit('join', {
        name: Cookies.get('id')
    });
    
    socket.on('mapUpdate', function(locations) {
        updateMap(map, locations);
    });

    window.setInterval(function () {
        socket.emit('mapUpdate', {
            id: Cookies.get('id'),
            bounds: map.getBounds(),
        });
    }, 5000);

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
                    content: `<div class='row popup-food'>
    
                                    <a href='/fooditem?id=${loc.MealID}''> 
                                        <img src='${loc.Image}' class='marker-image'>  
                                    </a>
                                    <div class="popup-food-data">
                                    <a href='/fooditem?id=${loc.MealID}''> 
                                        <h3> ${loc.Name} </h5>
                                    </a>
                                    <p> ${loc.Description} </p>
                                    </div>
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

