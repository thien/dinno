var express = require('express')
  , router = express.Router()

// Define routes handling profile requests

router.get('/', function(req, res) {
  res.render('register')
})

module.exports = router