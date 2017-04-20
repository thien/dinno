module.exports = function(app,express,io) {

	app.use(function(req,res,next){
	    req.io = io;
	    next();
	});

	// search item
	app.use('/', require('./search'));  

	// chat
	app.use('/', require('./chat'));  

	// front page
	app.use('/', require('./frontpage'));  

	// login page
	app.use('/', require('./login'));  

	// register page
	app.use('/', require('./register'));  

	// profile page
	app.use('/', require('./profile'));

	// report user
	app.use('/', require('./report')); 

	// settings
	app.use('/', require('./settings'));  

	// food item profile
	app.use('/', require('./fooditem'));  

	// add food item
	app.use('/', require('./add'));

	// add help/faqs
	app.use('/', require('./faqs'));  

	// manage fooditems
	app.use('/', require('./manage'));

	// admin
	app.use('/', require('./admin'));  

	// push notifications
	app.use('/', require('./push_notifications'));


	app.use('/', require('./barcode'));

	// add static assets for public access
	app.use('/assets', express.static('./views/assets'))
	app.use('/favicon.ico', express.static('./views/assets/icons/favicon.ico'));

	// add error message - THIS MUST BE THE LAST ROUTE TO BE DEFINED
	app.use('/', require('./error'));
	  
}