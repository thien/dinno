// initiate dependencies
var express = require('express')
  , fs = require('fs');
  , bodyParser = require('body-parser')
  , MarkdownIt = require('markdown-it')
  , mysql = require('node-mysql')
  , port = process.env.PORT || 3000
  , app = express()
  , md = new MarkdownIt()
  , DB = mysql.DB

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

app.set('views', __dirname + '/views')
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(require('./controllers'))

app.listen(port, function() {
    console.log('Listening on port ' + port)
})