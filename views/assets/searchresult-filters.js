
    //console.log(k)
    //- $("form#filters").submit(function(e){
    //-   var form = this;
    //-   $.getJSON('https://maps.googleapis.com/maps/api/geocode/json',{address: $("input#newName").val(), key: "AIzaSyCRkjhwstQA0YAqgmXH0-nmrO_hJ1m6pao"},function(data){
    //-     $("form#filters").append("<input type='text' name='food' value='"+$("#navsearchbar").val()+"'></input>")
    //-     $("form#filters").append("<input type='text' name='lat' value='"+data.results[0].geometry.location.lat+"'></input>")
    //-     $("form#filters").append("<input type='text' name='lng' value='"+data.results[0].geometry.location.lng+"'></input>")
    //-   })
    //-   e.preventDefault();
    //-   setTimeout(function(){
    //-     form.submit()
    //-   },500)
    //- })
    //- console.log($("#navsearchbar").val());
$("form#filters").append("<input type='hidden' name='food' value='" + $("#navsearchbar").val() + "'></input>")  //append data from navbar to this form so filtering can be done
$("form#filters").append("<input type='hidden' name='location' value='" + $("#navsearchbarlocation").val() + "'></input>")

$("form#filters").submit(function() {
    e.preventDefault();
    var form = this;
    var location = "";

    //- document.cookie += ";"

    //- if($("input#newName").val() == ""){
    //-   location += Cookies.get('lat') + "," + Cookies.get('lng')
    //- }else{
    //-   location = $("input#newName").val()
    //- }


    form.submit();
})

$("input#range").change(function() {
    document.getElementById("rangeVal").value = $(this).val(); //if value changes in slider then change input
})

$("input#rangeVal").change(function() {
    document.getElementById("range").value = $(this).val(); //opposite of above
})

var tags = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: k
}); //create type ahead suggestion engine

// deals with tags
tags.initialize();
$('input#tag').tagsinput({
    tagClass: 'badge-danger',
    typeaheadjs: {
        source: tags.ttAdapter()
    }
    //initialise input to be a tag input
});
$('input').on('beforeItemAdd', function(event) {
    var exists = false
    if (k.indexOf(event.item) > -1) {
        exists = true;
    }
    event.cancel = !exists
    // if tag doesnt exist in database then don't add it
});

// range slider


var rangeSlider = function(){
  var slider = $('.range-slider'),
      range = $('.range-slider__range'),
      value = $('.range-slider__value');

  // value.html(range.value + "km");
    
  slider.each(function(){

    value.each(function(){
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });

    range.on('input', function(){
      $(this).next(value).html(this.value + "km");
    });
  });
};

rangeSlider();

if (browser.name === "IE"){
    document.getElementsByClassName("range-slider__range")[0].style.width = "100%";
    document.getElementsByClassName("range-slider__value")[0].style.visibility = "hidden"; 
}
document.getElementsByClassName('range-slider__value')[0].innerHTML =  document.getElementsByClassName('range-slider__range')[0].value + "km";