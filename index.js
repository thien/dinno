// load depdendencies
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
// const mysql = require('node-mysql');
const fs = require('fs');
const pug = require('pug');
// const cps = require('cps');

const database = require('mysql');

// initiate express, socket and database
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


//database key
var db_keys = {};
try {
    var k = JSON.parse(fs.readFileSync('config/database.json', 'utf8'));
    db_keys = {
        host: k.host,
        user: k.user,
        password: k.password,
        database: k.database
    }
    // db_keys = { //temporary keys to work with my db 
    //     host: "localhost",
    //     user: "root",
    //     password: "meme1234",
    //     database: "testDatabase"
    // }
    console.log("Secret Database Keys are found locally.");
} catch (err) {
    // secret file isn't found.
    console.log("Secret Database Keys aren't found.");
    console.log("Attempting to Allocate from Heroku Servers.");
    db_keys = {
        host: process.env.JAWSDB_SERVER,
        user: process.env.JAWSDB_USER,
        password: process.env.JAWSDB_PASS,
        database: process.env.JAWSDB_DB
    }
}

// connect to database
var db = database.createConnection(db_keys);
db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    } 
    console.log('Connected to Database - ' + db.threadId);
});


// deal with port
const port = process.env.PORT || 8080;

//Configure express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// make sure bower compoments are directed right.
// app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use("/data", express.static(__dirname + '/data'));

// manage views
app.set('views', __dirname + '/views')
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')
app.locals.basedir = __dirname + '/views';
// app.set('view options', { basedir: __dirname})




// socket chatting
io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        console.log(msg);
        msg.timestamp = new Date();
        msg.sendername = "John Cena"
        // io.sockets.in(msg['from']).emit('chat message', msg['from'] + ":  " + msg['contents']);
        // io.sockets.in(msg['to']).emit('chat message', msg['from'] + ":  " + msg['contents']);

        // brocadcast to everyone; testing purposes
        io.emit('chat message', msg);
    });
    socket.on('join', function (data) {
        io.emit('server message', data.name + " has joined");
        socket.join(data.name);
    });
});


// search item

// app.use('/', require('./routes/search'));  
app.get('/search', function (req, res) {
    var food_item = req.query.food;
    var param = {
        food: food_item
    }
    console.log("someone's searching for", param)

    db.query('SELECT * FROM availableFood WHERE(availableFood.Food LIKE ?)',[food_item], function (error, results, fields) {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        console.log(fields);
    });

    res.render('searchitem', param);
})

// chat
app.use('/', require('./routes/chat'));  

// front page
app.use('/', require('./routes/frontpage'));  

// login page
app.use('/', require('./routes/login'));  

// register page
app.use('/', require('./routes/register'));  

// profile page
app.use('/', require('./routes/profile'));  

// food item
app.use('/', require('./routes/fooditem'));  

server.listen(port, function () {
    // notify user that server is running
    console.log('Listening on port ' + port);
    console.log("the FAQ page can be seen on http://localhost:8080/");
});
