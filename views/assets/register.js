function validatePassword() {
  var hasLetter = /^(.*[a-zA-Z].*)$/;
  var hasNumber = /^(.*[0-9].*)$/

  var pass = $("#password").val();
  
  if (pass.length >= 8 && hasLetter.test(pass) && hasNumber.test(pass)){
    $("#password").removeClass("invalid-input").addClass("valid-input");
    $("#btn-submit").prop("disabled", false);
    return true;
  }
  else{
    $("#password").removeClass("valid-input").addClass("invalid-input");
    $("#btn-submit").prop("disabled", true);
    return false;
  }
}

function verifyPassword() {
  var p1 = $("#password").val();
  var p2 = $("#password-verify").val()
  if (validatePassword() && p1 === p2){
    $("#password-verify").removeClass("invalid-input").addClass("valid-input");
    $("#btn-submit").prop("disabled", false);
  }
  else{
    $("#password-verify").removeClass("valid-input").addClass("invalid-input");
    $("#btn-submit").prop("disabled", true);
  }
}

$(document).ready(function(){
  $("#password").keyup(validatePassword);
  $(".password").keyup(verifyPassword);
});