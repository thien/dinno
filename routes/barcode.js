const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

module.exports = function() {
	var express = require('express');
	var app = express();
	var getJSON = require('get-json')
	app.locals.basedir = "." + '/views';

	app.get('/api/barcode', function(req, res) {
		getJSON("http://eandata.com/feed/?v=3&keycode=C3AA45D258F231CD&mode=json&find="+req.query.code,function(error,response){
			//console.log(response)
			res.status(200).send(response)
		})

		//{v:3,keycode:"C3AA45D258F231CD", mode:"json",find:req.code},
	}, function(err) {
		res.render('error', param);
	})
	return app;
}();