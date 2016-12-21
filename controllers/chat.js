var express = require('express')
  , router = express.Router()
var http = require('http').Server(router);
var io = require('socket.io')(http);

router.get('/', function(req, res) {
    res.render('chat', {})
})

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log(msg['contents']);
        io.sockets.in(msg['from']).emit('chat message', msg['from'] + ":  " + msg['contents']);
        io.sockets.in(msg['to']).emit('chat message', msg['from'] + ":  " + msg['contents']);
    });
    socket.on('join', function (data) {
        io.emit('server message', data.name + " has joined");
        socket.join(data.name); 
    });
});


module.exports = router
