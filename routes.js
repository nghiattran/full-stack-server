/**
 * Main application routes
 */

'use strict';


exports = module.exports = function(app) {
	app.use('/api/user', require('./api/user'));
	app.use('/auth', require('./api/auth'));

	// // All undefined asset or api routes should return a 404
	// app.route('/:url(api|auth|components|app|bower_components|assets)/*')
	//  .get(errors[404]);

	app.all('*', function(req, res) {
		res.json({error: '404'});
	})
}
