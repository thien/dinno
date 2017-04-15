const db = require('../functions/database');

module.exports = function Server(io, server) {

    // socket.io operations
    io.on('connection', function(socket) {
        console.log("connected to notifications")
        socket.send(socket.id);

        socket.on('disconnect', function() {
            console.log('A user has disconnected')
        });
    });

    return this;
};