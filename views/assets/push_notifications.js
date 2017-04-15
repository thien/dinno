var socket = notifications_io();

function sendNotification(content){
	console.log(content);
	socket.emit('notification', content);
}

$('#send').click(function(){
	console.log("hi");
});	//sendNotification(document.getElementById('content').val()