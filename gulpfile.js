var gulp = require('gulp');
var nodemon = require('nodemon')
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');

gulp.task('start', function () {
	nodemon({
		script: 'app.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'test' }
	})
})

// gulp.task('start', function () {
// 	nodemon({
// 		script: 'app.js',
// 		ext: 'js html',
// 		env: { 'NODE_ENV': 'test' }
// 	})
// })

gulp.task('test::user', function () {
	return gulp.src('api/user/user.spec.js', {read: false})
		.pipe(mocha({reporter: 'nyan'}))
		.on('error', err => {
            console.log(err)
        }).on('end', () => {
            process.exit();
        });
});

gulp.task('test', function cb () {
	process.env.NODE_ENV = 'test';
	process.env.PORT = 8000;
	runSequence(['test::user'], cb);
});