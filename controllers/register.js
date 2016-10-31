var express = require('express')
  , router = express.Router()
  , bodyParser = require('body-parser')

// Define routes handling profile requests

router.get('/', function(req, res) {
 //  res.render('register', {
 //    name: req.body.name,
 //    pass: req.body.password,
 //    mail: req.body.email,
 //     dob: req.body.dob
	// })
	res.render('register', {
    name: "lol",
    pass: "lol",
    mail: "lol",
     dob: "lol"
	})
})


router.post('/', function (req, res) {
	//validate the shit
	console.log(req.body.name);
	console.log(req.body.email);
    res.render('render', { email: req.body.email, name: req.body.name });
});
module.exports = router