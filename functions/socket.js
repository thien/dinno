var querystring = require('querystring');
var request     = require('request');
var dateFormat  = require('dateformat');
var chat        = require('../functions/chat');
var map         = require('../functions/map');
const db        = require('../functions/database');

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
                
                msg.day        =  dateFormat(currentTime, "dddd dS mmmm");
                msg.timestamp  =  dateFormat(currentTime, "HH:MM");

                
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
            var client = req.id;
            
            map.getLocations().then(function(locations) {
                io.sockets.in(client).emit('mapUpdate', locations);
            }, function(err) {

            });
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