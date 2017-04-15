var notifications_socket = io();
var db = require('../functions/database');
var login = require('../functions/login');

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

function notify(){
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

function getRecents(userID){
	return new Promise(function(resolve, reject) {
		db.query(`SELECT Recents.One, Recents.Two, Recents.Three, Recents.Four, Recents.Five, Recents.Six, Recents.Seven, Recents.Eight, Recents.Nine, Recents.Ten
				  FROM Recents
				  WHERE Recents.UserID = ?`, [userId],
			function(error, results, fields) {
				if (error) {
					console.log(error);
					reject();
				} else {
					resolve(results);
				}
			});
	});
}

$('document').ready(function(){
	$('#send').click(function(){
		notify();
		sendNotification(document.getElementById('content').value);
	});
});