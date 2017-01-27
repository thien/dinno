const database = require('mysql');
const fs = require('fs');

//database key
var db_keys = {};
try {
    var k = JSON.parse(fs.readFileSync('./config/database.json', 'utf8'));
    console.log(k);
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

var db = database.createConnection(db_keys);
db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    } 
    console.log('Connected to Database - ' + db.threadId);
});

module.exports = db;