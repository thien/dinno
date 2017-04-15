var notifications_socket = notifications_io();

function sendNotification(content){
	console.log(content);
	//socket.emit('notification', content);
}

$('document').ready(function(){
	$('#send').click(function(){
		sendNotification(document.getElementById('content').value);
	});
});