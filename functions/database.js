const database = require('mysql');
const fs = require('fs');

//database key
var db_keys = {};
try {
    var db_keys = JSON.parse(fs.readFileSync('./config/database.json', 'utf8'));

    console.log("Secret Database Keys are found locally.");
} catch (err) {
    // secret file isn't found.
    console.log(err);
    console.log("Secret Database Keys aren't found.");
    console.log("Attempting to Allocate from Heroku Servers.");
    db_keys = {
        host: process.env.JAWSDB_SERVER,
        user: process.env.JAWSDB_USER,
        password: process.env.JAWSDB_PASS,
        database: process.env.JAWSDB_DB
    };
}

db_keys.multipleStatements = true;

var db = database.createConnection(db_keys);
db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    } 
    console.log('Connected to Database - ' + db.threadId);
});

// load the database file.

db.query("DROP DATABASE " + db_keys.database, function (error, results, fields) {
    console.log("cleared database");
    db.query("CREATE DATABASE " + db_keys.database, function (error, results, fields) {
        console.log("created new database");
        db = database.createConnection(db_keys);
        db.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            } 
            console.log('Connected to Database - ' + db.threadId);

            var base_db_code = fs.readFileSync('./database/dinno_database_v1.sql').toString();

            db.query(base_db_code, function (error, results, fields) {
                if (error) { 
                    console.log("found error with loading the database file.");
                    console.log(error); 
                }
                else { 
                    console.log('Loaded core database file.'); 
                }
            });
        });
    });
});

// 'Temp' fix for database error
// Think it was something to do with async 
db = database.createConnection(db_keys);
db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    } 
    console.log('Connected to Database - ' + db.threadId);
});



module.exports = db;

