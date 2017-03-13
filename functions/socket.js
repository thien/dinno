var querystring = require('querystring');
var request     = require('request');
var chat        = require('../functions/chat');
var dateFormat  = require('dateformat');

module.exports = function Server(io, server) {

    // socket.io operations
    io.on('connection', function(socket) {
        console.log("a new human has connected")
            // send the clients id to the client itself.
        socket.send(socket.id);

        socket.on('join', function (data) {
            socket.join(data.name); 
        });

        socket.on('chat message', function(msg) {
            var currentTime = new Date();
            var senderId = msg['from'];
            console.log(msg);
            chat.getSenderName(senderId).then(function(name) {
                msg.sendername = name;

                var hours = currentTime.getHours().toString();
                var mins  = currentTime.getMinutes().toString();    
                if (hours.length == 1) { hours = "0" + hours; }
                if (mins.length == 1)  { mins = "0" + mins; }
                msg.timestamp = `${hours}:${mins}`; 

                
                io.sockets.in(msg['from']).emit('chat message', msg);
                io.sockets.in(msg['to']).emit('chat message', msg);
                
                dateFormat(currentTime, "YYYY-MM-DD HH:MM:SS");

                chat.saveMessage(msg.from, msg.to, msg.contents, currentTime);
                console.log(msg)
            }, function(err) {

            });
            
        });

        socket.on('imageupload', function(img_json) {
            // console.log("upload this pls:", img);

            console.log("received an image to upload");
            console.log(img_json.id)

            // console.log(img_json.src)
            img_json.src = img_json.src.replace("data:image/png;base64,", "");

            upload(img_json.src, function(err, response){
            	// console.log(response.data.link)
            	var resp_img = {
            		'id' : img_json.id,
            		'url': response.data.link
            	}
            	socket.emit('img_uploaded', resp_img);
            	console.log("sent back image uploaded.");
            })

        });

        socket.on('mapUpdate', function(req) {
            console.log("request for map update");
            console.log(req)
            
            var client = req.id;
            var locations = [
                {lat: 54.766866, lng: -1.5749834, locationName: 'Billy B', foodName: 'cheese'},
                {lat: 54.778665, lng: -1.5588949, locationName: 'John\'s House', foodName: 'burnt pasta'},
            ];

            io.sockets.in(client).emit('mapUpdate', locations);
        });

        socket.on('disconnect', function() {
            console.log('A user has disconnected')
        });
    });

    return this;
};

function upload(file, done) {
	var options = {
	    url: 'https://api.imgur.com/3/upload',
	    headers: {
	        'Authorization': 'Client-ID d61bcbe808b131a'
	    }
	};
	var post = request.post(options, function(err, req, body) {
	    try {
	        done(err, JSON.parse(body));
	    } catch (e) {
	    	console.log("something bad happened")
	        done(err, body);
	    }
	});
	var upload = post.form();
	upload.append('type', 'base64');
	upload.append('image', file);
}