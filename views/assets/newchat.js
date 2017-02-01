var socket = io();
var oldName = "";
$('form').submit(function() {
    var message = $('#messagebox').val();
    console.log(message);


    socket.emit('chat message', {
        contents: message
    });

    // reset value of the message box
    $('#messagebox').val('');
    return false;
});
socket.on('chat message', function(msg) {
    console.log("from server", msg);


    // time = msg.timestamp.getHours().toString() + ":" + msg.timestamp.d.getMinutes().toString() // => 9
    // console.log(time);


    // create message container
    var message_container = document.createElement('div');
    var ghetto = '<div class="media msg"><div class="media-body"><small class="pull-right time">';
    ghetto += '<i class="fa fa-clock-o"></i> '+msg.timestamp+'</small>';
    ghetto += '<h5 class="media-heading">'+msg.sendername+'</h5>';
    ghetto += '<small class="col-lg-10">'+msg.contents+'</small></div></div>';
    // append to client's messagebox

    // $('.msg-wrap').append($('<li>').text(msg.contents));
    $('.msg-wrap').append(ghetto);

    // scroll down after the message has been added.
    $(".msg-wrap").scrollTop($(".msg-wrap")[0].scrollHeight);
});
socket.on('server message', function(msg) {
    $('#messages').append($('<li class="server-message">').text(msg));
});


