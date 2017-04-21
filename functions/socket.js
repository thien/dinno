var querystring = require('querystring');
var request     = require('request');
var dateFormat  = require('dateformat');
var chat        = require('../functions/chat');
var map         = require('../functions/map');
const db        = require('../functions/database');

module.exports = function Server(io, server) {

    // socket.io operations
    io.on('connection', function(socket) {
        console.log(`New socket connection ${socket.id}`);
        // send the clients id to the client itself.
        socket.send(socket.id);
        
        // Join a room, used for non-global messages
        socket.on('join', function (data) {
            socket.join(data.name);
        });

        socket.on('chat message', function(msg) {
            // get time message was sent
            var currentTime = new Date();
            var senderId = msg['from'];
            chat.getSenderName(senderId).then(function(name) {
                // default to dinnobot if not specified
                msg.to = msg.to || 1;
                msg.sendername = name;
                
                // get nice date format for display
                msg.day        =  dateFormat(currentTime, "dddd dS mmmm");
                msg.timestamp  =  dateFormat(currentTime, "HH:MM");

                // send message to both users
                io.sockets.in(msg['from']).emit('chat message', msg);
                io.sockets.in(msg['to']).emit('chat message', msg);
                
                // save message in history
                dateFormat(currentTime, "YYYY-MM-DD HH:MM:SS");
                chat.saveMessage(msg.from, msg.to, msg.contents, currentTime);
                console.log(msg)
            }, function(err) {
                console.log(err)
            });
            
        });

        socket.on('user search', function(req) {    
            var name = req.q;
            chat.searchUsers(name).then(function(res){
                socket.emit('user search results', res);
            });
        });

        socket.on('imageupload', function(img_json) {
            // function to deal with uploading base64 images

            console.log("received an image to upload");
            console.log(img_json.id)

            // how nasty is that lol
            var fileType = img_json.src.split('/')[1].split(';')[0];   
            img_json.src = img_json.src.replace(`data:image/${fileType};base64,`, "");

            // send image to imgur and retrieve a URL to return back
            upload(img_json.src, function(err, response){
            	console.log(response.data.link)
            	var resp_img = {
            		'id' : img_json.id,
            		'url': response.data.link
            	}
            	socket.emit('img_uploaded', resp_img);
            	console.log("sent back image uploaded.");
            });

        });

        socket.on('mapUpdate', function(req) {
            var client = req.id;
            map.getLocations(req.bounds).then(function(locations) {
                io.sockets.in(client).emit('mapUpdate', locations);
            }, function(err) {

            });
        });

        socket.on('food_added', function(content) {
            getUsersSearchingForFood(content.name).then(function(hungryUsers) {
                for (var i = 0; i<hungryUsers.length; i++) {
                    content.userID = hungryUsers[i];
                    console.log(content);
                    io.sockets.in(content.userID).emit('new_food_notification', content);
                }
            });
        });

        socket.on('disconnect', function() {
            console.log('A user has disconnected')
        });
    });

    return this;
};

function upload(file, done) {
    // function that deals with uploading images using the Imgur API
	var options = {
	    url: 'https://api.imgur.com/3/upload',
	    headers: {
	        'Authorization': 'Client-ID d61bcbe808b131a'
	    }
	};
    // variable for setting up the api call to the Imgur service.
	var post = request.post(options, function(err, req, body) {
	    try {
            // return successfully.
	        done(err, JSON.parse(body));
	    } catch (e) {
            // theres an error; return that instead
	    	console.log("something bad happened: ", e);
	        done(err, body);
	    }
	});
    // run the form.
	var upload = post.form();
    // append the files
	upload.append('type', 'base64');
	upload.append('image', file);
}

function getUsersSearchingForFood(foodname){
    console.log(foodname);
    return new Promise(function(resolve, reject) {
        db.query(`SELECT Recents.UserID 
                  FROM Recents
                  WHERE Recents.Foodname LIKE ?`, ['%'+foodname+'%'],
            function(error, results, fields) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    var hungryUsers = [];
                    var n = results.length;
                    for (var i = 0; i < n; i++) {
                        hungryUsers.push(results[i].UserID);
                    }
                    //get unqiue array of users
                    /*uniqueArray = myArray.filter(function(elem, pos) {
                        return myArray.indexOf(elem) == pos;
                    })*/
                    resolve(hungryUsers);
                }
            });
    });
}