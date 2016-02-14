/**
 * Main application routes
 */

'use strict';


exports = module.exports = function(app) {
	// // Insert routes below
	// app.use('/api/things', require('./api/thing'));
	app.use('/api/user', require('./api/user'));

	// app.use('/auth', require('./auth'));

	// // All undefined asset or api routes should return a 404
	// app.route('/:url(api|auth|components|app|bower_components|assets)/*')
	//  .get(errors[404]);

	// // All other routes should redirect to the index.html
	app.all('*', function(req, res) {
		res.render('index.html');
	})
}
