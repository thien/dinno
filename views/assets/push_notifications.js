if(!socket){
	var socket = io();
}

//copy this onto each pug page notifications are needed: (if they aren't already included...)
/*script
	include assets/js-cookie.js
	include assets/push_notifications.js*/

// joins the users private room
socket.emit('join', {name: Cookies.get('id')});

// only sends the notification out if on added_page, this tests if it is this page

if(document.getElementById('lovelymsg')){
	foodNotification(getNotificationContent());
}
waitForNotification();

// waits for socket event and notifies user if applicatable i.e. they want it and it is for them

function waitForNotification(){
	socket.on('new_food_notification', function(notification_content){
	   	if (Notification.permission === 'granted' && ('Notification' in  window)) {	//document.getElementById('lovelymsg') &&  add this
			var notification = new Notification('Dinno', notification_content);
		}
		else if(!('Notification' in window)){
			alert("This browser does not support desktop notification!");
		}
	});
}

// this checks and asks for permission to send notifications

function notify(){
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        //do nothing but we can send notifications!
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }

            if (permission === "granted") {
                var options = {
                    body: "Welcome to Dinno Notifications!",
                    icon: 'http://127.0.0.1:8080/assets/dinnosaur/bw.svg',
                    dir : "ltr"
                };
                var notification = new Notification("Dinno",options);
            }
        });
    }
}

// used to send the event to the server via the socket, called on the added_fooditem page

function foodNotification(notification_content){
	console.log(Cookies.get('id'));
	socket.emit('food_added', {
    	userID: Cookies.get('id'),
    	body: notification_content.body,
    	icon: notification_content.icon,
    	dir: 'ltr',
    	name: notification_content.name
	});
}

function getNotificationContent(){
	var new_food = document.getElementById('smallmsg').innerHTML.split(' is now added')[0];
	
	var notification_content = {
        body: "Some new tasty "+new_food+" is now avaiable!",
        icon: document.getElementById('foodimageurl').src,
        dir : "ltr",
        name: new_food
    }
    return notification_content;
}