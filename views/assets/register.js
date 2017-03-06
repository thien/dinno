function updateSubmitButton() {
  // All 5 form inputs must be valid
  if ($(".valid-input").length == 5) {
    $("#btn-submit").prop("disabled", false);
  }
}

function updateValidity(input, isValid) {
  if (isValid) {
    $(input).removeClass("invalid-input").addClass("valid-input");
    updateSubmitButton();
  }
  else {
    $(input).removeClass("valid-input").addClass("invalid-input");
    $("#btn-submit").prop("disabled", true);
  }
}

function validateFirstName() {
  var forename = $("#forename").val();
  if (forename.length > 0) { 
    updateValidity("#forename", true);
    return true;
  }
  else {
    updateValidity("#forename", false);
    return false;
  }
}

function validateSurname() {
  var surname = $("#surname").val();
  if (surname.length > 0) { 
    updateValidity("#surname", true);
    return true;
  }
  else {
    updateValidity("#surname", false);
    return false;
  }
}

function validateEmail() {
  var isValidEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var email = $("#email").val();

  if (isValidEmail.test(email)) { 
    updateValidity("#email", true);
    return true;
  }
  else {
    updateValidity("#email", false);
    return false;
  }
}

function validatePassword() {
  var hasLetter = /^(.*[a-zA-Z].*)$/;
  var hasNumber = /^(.*[0-9].*)$/

  var pass = $("#password").val();
  
  if (pass.length >= 8 && hasLetter.test(pass) && hasNumber.test(pass)){
    updateValidity("#password", true);
    return true;
  }
  else{
    updateValidity("#password", false);
    return false;
  }
}

function verifyPassword() {
  var p1 = $("#password").val();
  var p2 = $("#password-verify").val()
  if (validatePassword() && p1 === p2){
    updateValidity("#password-verify", true);
  }
  else{
    updateValidity("#password-verify", false);
  }
}


$(document).ready(function(){
  $("#btn-submit").prop("disabled", true);
  $('#forename').keyup(validateFirstName);
  $('#surname').keyup(validateSurname);
  $("#email").keyup(validateEmail);
  $("#password").keyup(validatePassword);
  $(".password").keyup(verifyPassword);

  // initialise each form input
  $(".form-control").keyup();
});