// set latitude location with cookie variables
$('input[name="lat"]').val(Cookies.get('lat'));
$('input[name="lng"]').val(Cookies.get('lng'));

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

var arrow_loading_interval = setInterval(function(){
    $(".arrowloading").toggleClass("arrowpulse");
 },500)


$(document).on('click', '#locationarrow', function(){

    console.log("You clicked the arrow")
    // commence getting the coordinates
    var arrow = document.getElementById("locationarrow");
    arrow.classList.add("arrowloading");
    arrow.classList.remove("arrowdone");

    // glow arrow to show that you are getting it.
    navigator.geolocation.getCurrentPosition(coord_base_success, coord_base_error);
});

function coord_base_success(position) {
    var latitude  = position.coords.latitude.toFixed(4).toString();
    var longitude = position.coords.longitude.toFixed(4).toString();

    var coords = latitude +","+ longitude
    console.log("gps coord:",coords);
    // document.getElementById("location_text").innerHTML = coords.toString()

    var arrow = document.getElementById("locationarrow");
    arrow.classList.remove("arrowloading");
    arrow.classList.add("arrowdone");

    storeCoordinatesinCookies(latitude,longitude);
    $('input[name="lat"]').val(latitude);
    $('input[name="lng"]').val(longitude);
    var stringer = latitude + "," + longitude;
    printEstLocation(stringer);
}

function coord_base_error() {
    $.getJSON('http://ipinfo.io', function(data){
        document.getElementById("location_text").innerHTML = data.loc + " (Est.)";
        printEstLocation(data.loc);
        console.log("ran error, est");
        console.log("est location", data.loc);
        var res = data.loc.split(",");
        // console.log(res)
        var latitude = res[0];
        var longitude = res[1];

        arrow.classList.remove("arrowloading");
        arrow.classList.add("arrowamber");
        
        storeCoordinatesinCookies(latitude,longitude);
        $('input[name="lat"]').val(latitude);
        $('input[name="lng"]').val(longitude);
    })
}

function printEstLocation(coord){
    $.getJSON('http://maps.google.com/maps/api/geocode/json?latlng=' + coord, function(data){
        console.log(data.results[2]);
        console.log(data.results[2].formatted_address);
        document.getElementById("navsearchbarlocation").value = data.results[2].formatted_address;
    })
}