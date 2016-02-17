var gulp = require('gulp');
var nodemon = require('nodemon')
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');
var istanbul = require('gulp-istanbul');
var cover = require('gulp-coverage');

gulp.task('start', function () {
	nodemon({
		script: 'app.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'dev' }
	})
})

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


gulp.task('pre-cover', function () {
  return gulp.src(['api/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .pipe(gulp.dest('test-tmp/'));
});

gulp.task('cover', ['pre-cover'], function () {
  process.env.NODE_ENV = 'test';
  process.env.PORT = 8000;
  return gulp.src('api/**/*.spec.js', {read: false})
    .pipe(mocha())
    .pipe(istanbul.writeReports(
        {
          dir: './coverage',
          reporters: ['html' ],
          reportOpts: { dir: './coverage' },
        }
      ))
    .on('error', err => {
      console.log(err);
      process.exit();
    })
    .on('end', () => {
        process.exit();
    });
});