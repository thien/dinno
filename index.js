// load depdendencies
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var mysql = require('node-mysql');
var fs = require('fs');
var DB = mysql.DB;
// initiate new twitter object

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

//initiate database connection
var db = new DB(db_keys);

// initiate express
const app = express();
const port = process.env.PORT || 8080;
const pug = require('pug');

//Configure express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// make sure bower compoments are directed right.
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// manage views
app.set('views', __dirname + '/views')
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')
app.locals.basedir = __dirname + '/views';
// app.set('view options', { basedir: __dirname})


// front page

app.get('/', function(req, res) {
    var user = req.query.user;
    var pass = req.query.pass;
    res.render('frontpage');
})

app.post('/login', function(req, res) {
    var user = req.body.user;
    var pass = req.body.pass;
    var param = { username: user, 
                  password: pass 
                }
    // console.log(req.body)
    // console.log(param)
    res.render('login', param);
})

// register page

app.get('/register', function(req, res) {
    res.render('register');
})

// login page

app.get('/login', function(req, res) {
    res.render('login');
})

// search item

app.get('/search', function(req, res) {
    console.log(req.query)
    console.log(req.body)
    var food_item = req.query.food;
    var param = {
        food: food_item
    }
    console.log(param)
    res.render('searchitem', param);
})


app.listen(port, function() {
    // notify user that server is running
    console.log('Listening on port ' + port);
    console.log("the FAQ page can be seen on http://localhost:8080/index.html");
})