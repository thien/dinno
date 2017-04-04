function updateSubmitButton() {
  // All 5 form inputs must be valid
  if ($(".valid-input").length == 8) {
    $("#submitter").prop("disabled", false);
  }
}

function updateValidity(input, isValid) {
  if (isValid) {
    $(input).removeClass("invalid-input").addClass("valid-input");
    updateSubmitButton();
  }
  else {
    $(input).removeClass("valid-input").addClass("invalid-input");
    $("#submitter").prop("disabled", true);
  }
}

function validateName() {
  var name = $("#name").val();
  if (name.length > 0) { 
    updateValidity("#name", true);
    return true;
  }
  else {
    updateValidity("#name", false);
    return false;
  }
}

function validateFoodtype() {
  var foodtype = $("#foodtype").val();
  if (foodtype == 'Meal' || foodtype == 'Ingredient') { 
    updateValidity("#foodtype", true);
    return true;
  }
  else {
    updateValidity("#foodtype", false);
    return false;
  }
}

function validateDescription() {
  var description = $("#description").val();
  if (description.length > 0) { 
    updateValidity("#description", true);
    return true;
  }
  else {
    updateValidity("#description", false);
    return false;
  }
}

function validateDate() {
  var day = $("#day").val();
  var month = $("#month").val();
  var year = $("#year").val();

  var date = new Date(year, month - 1, day);
  var now = new Date();

  if (date >= now){
    updateValidity(".date", true);
    return true;
  }
  else{
    updateValidity(".date", false);
    return false;
  }
}

function validateLocation() {
  var location = $("#location").val();
  if ($("#use-current-location").is(':checked')){
    updateValidity("#location", true);
  }
  else {
    $.ajax({
      dataType: "json",
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      data: {address: location, key: "AIzaSyCRkjhwstQA0YAqgmXH0-nmrO_hJ1m6pao"},
      success: function(data){
        var res = data.results;
        if (res.length > 0) {
          $('#secret-lat-input').val(res[0].geometry.location.lat);
          $('#secret-lng-input').val(res[0].geometry.location.lng);
          updateValidity("#location", true);
        }
        else {
          updateValidity("#location", false);
        }
      },
      error: function(err){
        updateValidity("#location", false);
      }
    });
  }
}

function validateImage() {
  var image = $("#secret-image-input").val();
  if (image.length > 0){
    updateValidity("#upload_img_container", true);
    return true;
  }
  else{
    updateValidity("#upload_img_container", false);
    return false;
  }
}


$(document).ready(function(){
  $("#submitter").prop("disabled", true);
  $('#name').keyup(validateName);
  $('#foodtype').change(validateFoodtype);
  $('#description').keyup(validateDescription);
  $('#location').keyup(validateLocation);
  $('#use-current-location').change(validateLocation);
  $('.date').change(validateDate);
  $('#secret-image-input').change(validateImage);
  // initialise each form input
  $(".form-control").keyup();
  $(".form-control").change();
});