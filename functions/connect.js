/*
var mysql = require('mysql');
var dbconnection = mysql.createConnection({			credentials for logging into db
	host: '[database host]',
	user: '[user]',
	password: '[password]',
	database: '[database name]'
});
dbconnection.connect(function(err){ 				connect to database
	if(!err){
		console.log("Database is connected... nn");
	}else{
		console.log("Error connecting database... nn");
	}
});
*/
var search = ('bread'); //placeholder, needs a client input
function foodSearch(dbconnection, search){ 
  dbconnection.query('SELECT * FROM availableFood WHERE(availableFood.Food LIKE "%'+search+'%")',function(err,rows,field){
  //table names and fields not definite, will be changed if necessary
	  if(!err){
		  console.log("Something has gone right");
	  }else{
		  console.log("Something has gone wrong");
		  throw err;
	  }
	  console.log(rows); //needs returning to client
    //shutup
  });
}