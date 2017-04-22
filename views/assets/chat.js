var socket = io();
var oldName = "";
var lastDay = "Ages ago";

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();

socket.emit('join', {
    name: Cookies.get('id')
});


$('#message_send').submit(function() {
    var message = $('#messagebox').val();
    console.log(Cookies.get());
    socket.emit('chat message', {
        from: Cookies.get('id'),
        to: QueryString.id,
        contents: message
    });

    // reset value of the message box
    $('#messagebox').val('');
    return false;
});

$('#btn-message-send').click(function() {
   $('#message_send').submit();
});


$('#user-search').keyup(function() {
  var q = $('#user-search-box').val();
  socket.emit('user search', {
    q: q
  });
});


$('#btn-user-search').click(function() {
   $('#user-search').keyup();
});



socket.on('chat message', function(msg) {
    console.log("from server", msg);


    // filter out messages from other people
    if (msg.from == QueryString.id || msg.from == Cookies.get('id')){
      
      if (msg.day !== lastDay) {
        lastDay = msg.day;
        var dayHeader = "<div class='alert alert-info msg-date'> <strong> "+msg.day+" </strong> </div>";
        $('.msg-wrap').append(dayHeader);
      }

      // create message container
      var message_container =
'      <div class="media msg">'+
'        <div class="media-body">'+
'          <small class="pull-right time">'+
'            <i class="fa fa-clock-o"></i> '+msg.timestamp+
'          </small>'+
'          <h5 class="media-heading"> '+msg.sendername+' </h5>'+
'          <small class="col-lg-10"> '+msg.contents+' </small>'+
'        </div>'+
'      </div>';
      // append to client's messagebox

      $('.msg-wrap').append(message_container);

      // scroll down after the message has been added.
      $(".msg-wrap").scrollTop($(".msg-wrap")[0].scrollHeight);
    }

});
socket.on('server message', function(msg) {
    $('#messages').append($('<li class="server-message">').text(msg));
});

socket.on('user search results', function(res) {
  var users = '';
  res.forEach(function(u) {
    users +=  "<div class='media conversation user-search-result' onclick=\"location.href='/chat?id="+u.UserID+"';\">"+
                  "<a class='profileimg-list' href='/chat?id="+u.UserID+"'>"+
                    "<img class='media-object contact_photo sm' src='"+u.ProfileImage+"'>"+
                  "</a>"+
                  "<div class='media-body message-list-box'>"+
                    "<h5 class=' media-heading miniprofile-chat'>"+u.Firstname+" "+u.Surname+"</h5>"+
                  "</div>"+
                "</div>";
  });
  if (res.length > 0 ) {
    $('#user-search-results').addClass('found');
  }
  else {
    $('#user-search-results').removeClass('found');
  }
  var resBox = document.getElementById('user-search-results');
  resBox.innerHTML = users;
  
});

$(".msg-wrap").scrollTop($(".msg-wrap")[0].scrollHeight);


