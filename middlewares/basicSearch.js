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
