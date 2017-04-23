
socket = io();

//}
$(document).ready(function(){
    requestPermission();
    socket.emit('join', {name: Cookies.get('id')});
    console.log("joined " + Cookies.get('id'));
    waitForNotification();
})
// joins the users private room


// waits for socket event and notifies user if applicatable i.e. they want it and it is for them

function waitForNotification(){
	socket.on('new_food_notification', function(notification_content){
	   	if (!document.getElementById('lovelymsg') && Notification.permission === 'granted' && ('Notification' in  window)) {
			var notification = new Notification('Dinno', notification_content);
            console.log('New notification' + notification_content);
		}
		else if(!('Notification' in window)){
			// alert("This browser does not support desktop notification!");
            console.log("This browser doesn't support push notifications.");
            // abstract; the user doesn't need to know that they can't have notifications.
		}
	});
}

// this checks and asks for permission to send notifications

function requestPermission(){
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        //do nothing but we can send notifications!
        console.log("Notifications enabled");
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }

        });
    }
}

// used to send the event to the server via the socket, called on the added_fooditem page

// function foodNotification(notification_content){
// 	console.log('foodNotification' + notification_content);
// 	socket.emit('food_added', {
//     	userID: Cookies.get('id'),
//     	body: notification_content.body,
//     	icon: notification_content.icon,
//     	dir: 'ltr',
//     	name: notification_content.name
// 	});
// }

// function getNotificationContent(){
// 	var new_food = document.getElementById('smallmsg').innerHTML.split(' is now added')[0];
	
// 	var notification_content = {
//         body: "Some new tasty "+new_food+" is now avaiable!",
//         icon: document.getElementById('foodimageurl').src,
//         dir : "ltr",
//         name: new_food
//     }
//     return notification_content;
// }