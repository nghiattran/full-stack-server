var gulp = require('gulp');
var nodemon = require('nodemon')
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');
// var istanbul = require('istanbul');
var cover = require('gulp-coverage');

gulp.task('start', function () {
	nodemon({
		script: 'app.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'dev' }
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

gulp.task('coverage:integration', function cb () {
    return gulp.src('api/user/user.spec.js')
		.pipe(cover.instrument({
	        pattern: ['**/*spec.js'],
	        debugDirectory: 'debug'
	    }))
	    .pipe(mocha())
	    .pipe(cover.gather())
	    .pipe(cover.format())
	    .pipe(gulp.dest('reports'))
		.on('error', err => {
            console.log(err)
        }).on('end', () => {
            process.exit();
        });
});

gulp.task('cover', function cb () {
	process.env.NODE_ENV = 'test';
	process.env.PORT = 8000;
	runSequence(['coverage:integration'], cb);
});