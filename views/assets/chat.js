var socket = io();
var oldName = "";
$('form').submit(function() {
    if ($('#from').val() != oldName) {
        socket.emit('join', {
            name: $('#from').val()
        });
        oldName = $('#from').val();
    }
    socket.emit('chat message', {
        from: $('#from').val(),
        to: $('#to').val(),
        contents: $('#contents').val()
    });
    $('#contents').val('');
    return false;
});
socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
});
socket.on('server message', function(msg) {
    $('#messages').append($('<li class="server-message">').text(msg));
});