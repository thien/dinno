var socket = io();

var oldMarkers = {};

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
    var coord_lat = search_location.latitude;
    var coord_lng = search_location.longitude;

    // load google maps with 
    // console.log('hello');
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: {lat: coord_lat, lng: coord_lng},
    });

    var image = new google.maps.MarkerImage('../assets/map/map_basemarker.gif');
    var basePositionMarket = new google.maps.Marker({
        position: {lat: coord_lat, lng: coord_lng},
        map: map,
        title: 'Hello World!',
        icon: image,
        optimized: false,
      });

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
    
    Object.keys(locations).forEach(function(k) {
        var loc = locations[k];
        var markerId = `${loc[0].Latitude}${loc[0].Longitude}`;
        var popup = `<div class='row popup-food'>`;
        loc.forEach(function(food) {
            popup += `<div class='col-md-6'>
                        <a href='/fooditem?id=${food.MealID}''> 
                            <img src='${food.Image}' class='marker-image'>  
                        </a>
                        <div class="popup-food-data">
                            <a href='/fooditem?id=${food.MealID}''> 
                                <h3> ${food.Name} </h5>
                            </a>
                            <p> ${food.Description} </p>
                        </div>
                    </div>`;
        });
        popup += `</div>`;

        if (!oldMarkers[markerId]) {
            var marker = new google.maps.Marker({
                position: {lat: loc[0].Latitude, lng: loc[0].Longitude},
                map: map,
                title: `${loc[0].HouseNoName} ${loc[0].Street}`,
            });

            google.maps.event.addListener(marker, 'click', function(event) {
                var coordInfoWindow = new google.maps.InfoWindow({
                    content: popup,
                    position: marker.position
                });
                coordInfoWindow.open(map);
            });
            newMarkers[markerId] = marker;
            console.log(`Added ${markerId}`);
        }
        else {
            var marker = oldMarkers[markerId];
            newMarkers[markerId] = marker

            google.maps.event.clearInstanceListeners(marker);
            google.maps.event.addListener(marker, 'click', function(event) {
                var coordInfoWindow = new google.maps.InfoWindow({
                    content: popup,
                    position: marker.position
                });
                coordInfoWindow.open(map);
            });

            delete oldMarkers[markerId];
        }
    });

    Object.keys(oldMarkers).forEach(function(k) {
        var m = oldMarkers[k];
        m.setMap(null);
    });
    oldMarkers = newMarkers;
}

