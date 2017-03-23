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

	return app;
}();

