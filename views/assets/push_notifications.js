var notifications_socket = io();

function sendNotification(content){
	/*console.log(content);
	notifications_socket.emit('notification', content);*/
	var options = {
		body: "You just got a notification from dinno! \n"+content,
		icon: "icon.jpg",
		dir : "ltr"
	};
	var notification = new Notification("Dinno",options);
}

function notifyMe(){
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	}
	else if (Notification.permission === "granted") {
		/*var options = {
			body: "This is the body of the notification",
			icon: "icon.jpg",
			dir : "ltr"
		};
		var notification = new Notification("Hi there",options);*/
		//do nothing but we can send notifications!
	}
	else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
			if (!('permission' in Notification)) {
				Notification.permission = permission;
			}

			if (permission === "granted") {
				var options = {
					body: "This is the body of the notification",
					icon: "icon.jpg",
					dir : "ltr"
				};
				var notification = new Notification("Hi there",options);
			}
		});
	}
}

$('document').ready(function(){
	$('#send').click(function(){
		notifyMe();
		sendNotification(document.getElementById('content').value);
	});
});