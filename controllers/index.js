var express = require('express')
  , router = express.Router()

router.use('/comments', require('./comments'))
router.use('/register', require('./register'))
router.use('/users', require('./users'))

router.get('/', function(req, res) {
  res.render('index')
})

router.post('/', function (req, res) {
	//validate details
	console.log(req.body.username);
	console.log(req.body.password);
    res.render('index', { username: req.body.username, password: req.body.password });
});

module.exports = router