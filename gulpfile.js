var gulp = require('gulp');
var nodemon = require('nodemon')


gulp.task('start', function () {
	nodemon({
	script: 'app.js',
	ext: 'js html',
	env: { 'NODE_ENV': 'test' }
	})
})