var coord_lat = parseFloat(GETVariable("lat"));
var coord_lng = parseFloat(GETVariable("lng"));


function initMap(lat_lng) {

    // get latitude and longitude from GET variables
    var coord_lat = parseFloat(GETVariable("lat"));
    var coord_lng = parseFloat(GETVariable("lng"));

    // create base_coordinate
    const DURHAM_LAT_LNG = {
        lat: coord_lat,
        lng: coord_lng
    };

    // load google maps with 
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: DURHAM_LAT_LNG
    });

    // createMarker({
    //     lat: 54.766866,
    //     lng: -1.5749834
    // }, 'Billy B', 'cheese');
    // createMarker({
    //     lat: 54.778665,
    //     lng: -1.5588949
    // }, 'John\'s House', 'burnt pasta');
    createUserMarker(DURHAM_LAT_LNG);

    function createMarker(pos, t, food) {
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: t
        });
        google.maps.event.addListener(marker, 'click', function(event) {
            document.getElementById('lat').innerHTML = event.latLng.lat();
            document.getElementById('lng').innerHTML = event.latLng.lng();
            var coordInfoWindow = new google.maps.InfoWindow({
                content: '<button type="button">Get ' + food + ' at ' + marker.title + '</button>',
                position: marker.position
            });
            coordInfoWindow.open(map);
        });
        return marker;
    }

    function createUserMarker(pos) {
        var userMarker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Your Location',
            draggable: true,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        google.maps.event.addListener(userMarker, 'dragend', function(event) {
            document.getElementById('lat').innerHTML = event.latLng.lat();
            document.getElementById('lng').innerHTML = event.latLng.lng();
        })
        google.maps.event.addListener(userMarker, 'click', function(event) {
            createMarker({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            }, document.getElementById('newName').value, document.getElementById('food').value);
        });
        return userMarker;
    }
}

// function resizeMap() {
//     $(window).resize(function() {
//         var h = $(window).height(),
//             offsetTop = 60; // Calculate the top offset

//         $('#map-canvas').css('height', (h - offsetTop));
//     }).resize();
// }


$(document).ready(function() {
    initMap();

    socket.emit('join', {
        name: Cookies.get('id')
    });
    
    socket.on('mapUpdate', function(msg) {
        console.log(msg)
    });

    socket.emit('mapUpdate', {
        id: Cookies.get('id'),
        lat: coord_lat,
        lng: coord_lng,
    });

    
})