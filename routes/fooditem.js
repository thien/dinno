module.exports = function(){
	var express = require('express');
	var app = express();
	app.locals.basedir = "." + '/views';

	app.get('/fooditem', function (req, res) {
	    res.render('fooditem');
	})

	return app;
}();