var gulp = require('gulp');
var nodemon = require('nodemon')
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');
var istanbul = require('gulp-istanbul');
var cover = require('gulp-coverage');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var fixmyjs = require("gulp-fixmyjs");

gulp.task('start', function () {
	nodemon({
		script: 'app.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'dev' }
	}).on('change', function (argument) {
    // body...
  })
})

gulp.task('test', function cb () {
  process.env.NODE_ENV = 'test';
  process.env.PORT = 8000;

  return gulp.src('api/**/*.spec.js', {read: false})
    .pipe(mocha())
    .on('error', (err) => {
      console.log(err)
      process.exit();
    })
    .on('end', () => {
      process.exit();
    });
});


gulp.task('pre-cover', function () {
  // !(*spec).js : cover all files other then *spec.js files
  return gulp.src(['api/**/!(*spec).js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('cover', ['pre-cover'], function () {
  process.env.NODE_ENV = 'test';
  process.env.PORT = 8000;
  return gulp.src('api/**/*.spec.js', {read: false})
    .pipe(mocha())
    .pipe(istanbul.writeReports(
      {
        dir: './coverage',
        reporters: ['html', 'text', 'text-summary'],
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


gulp.task('lint', function() {
  return gulp.src('api/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('fix', function() {
  return gulp.src("./api/user/*.js")
    .pipe(fixmyjs())
    .pipe(gulp.dest("./api/user"));
});

gulp.task('fixjs', function() {
  return gulp.src("./api/user/*.js")
    .pipe(fixmyjs())
    .pipe(gulp.dest("./www/"));
});