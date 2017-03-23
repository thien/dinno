module.exports = function(){
	var express = require('express');
	var app = express();
	app.locals.basedir = "." + '/views';

	app.get('/error', function (req, res) {
		var error_message = {
			msg:"You tell me brro"
		};
		res.render('error', error_message);
	})

	//The 404 Route (ALWAYS Keep this as the last route)
	app.get('*', function(req, res){
		var error_message = {
			msg:"This is an error 404, as in the page you're looking for is in another castle."
		};
		res.render('error', error_message);
	});

	return app;
}();

