/***
*	gulp script
* 2016 Amon Keishima
*/

var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');
var sftp = require('gulp-sftp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');

// Stylus -> css
var stylus = require('gulp-stylus');
var nib = require('nib');

// jade -> html
var jade = require('gulp-jade');

// uglify js
var uglify = require("gulp-uglify");

// browser-sync
var browserSync = require('browser-sync');

var runSequence = require('run-sequence');

var config = {
		production: !!util.env.production
};

// If you type only "gulp", this task will be executed.
// It clears all your dist folder, and build your project.
// Browser will automatically open, and you can preview your project.
gulp.task('default', function(callback) {
	runSequence('clean', 'bundle', 'build', 'connect', ['watch', 'watch-dist'], callback);
});

// Build & Upload files to specific server via SFTP
gulp.task('upload', function(callback) {
	runSequence('clean', 'bundle', 'build', 'php', 'sftp', callback);
});

// Upload every single files on dist folder.
// Authentication info has to be written in .ftppass file.
// Be sure to add *.ftppass into .gitignore files.
gulp.task('sftp', function () {
	return gulp.src('dist/**/*')
		.pipe(sftp({
			host: '153.126.128.58',
			auth: 'pittankopta.net',
			remotePath: '/home/pittan/web/pittankopta.net/html/'
	}));
});

// Build all source files.
// All task runs in parallel.
gulp.task('build', ['jade', 'stylus', 'js', 'image']);

// Watch files and if something change,
// It will rebuild.
gulp.task('watch', function() {
	gulp.watch(['src/**/*.js'],['js']);
	gulp.watch(['src/**/*.styl'],['stylus']);
	gulp.watch(['src/**/*.jade'],['jade']);
	gulp.watch(['src/**/*.{png,jpg,gif}'],['image']);
});

// If something changed in dist folder,
// BrowserSync will reload all previews.
gulp.task('watch-dist', function() {
	return gulp.watch(['dist/**/*'], function() { browserSync.reload(); });
});

// Clean up your dist folder.
// Strongly recommended to run it first.
gulp.task('clean', function(cb) {
	return del(['dist'], cb);
});

// Make a nice local server to preview your page.
gulp.task('connect', function() {
	return browserSync({
		server: { baseDir: "dist" }
	});
});

// Compile stylus files to CSS.
gulp.task('stylus', function() {
	return gulp.src('src/**/*.styl')
		.pipe(plumber())
		.pipe(stylus({
			use: [nib()],
			compress: true,
			linenos: false
		}))
		.pipe(gulp.dest('dist/'));
});

// Compile jade files to HTML.
gulp.task('jade', function() {
	return gulp.src('src/**/*.jade')
		.pipe(plumber())
		.pipe(jade({
			pretty: config.production,
			locals: {
				production: config.production
			}
		}))
		.pipe(gulp.dest('dist/'));
});

// Uglify .js and rename it to .min.js
gulp.task('js', function() {
	return gulp.src('src/**/*.js')
		.pipe(config.production ? uglify() : util.noop())
		.pipe(config.production ? rename({ suffix: '.min' }) : util.noop())
		.pipe(gulp.dest('dist/'));
});

// Copy images and HTML
gulp.task('image', function() {
	return gulp.src('src/**/*.{png,jpg,gif,html}')
		.pipe(gulp.dest('dist/'));
});

// Copy PHP Files
gulp.task('php', function() {
	return gulp.src('src/**/*.php')
		.pipe(gulp.dest('dist/'));
});

// Copy something you want in bundle folder.
gulp.task('bundle', function() {
	return gulp.src('src/bundle/**/*')
		.pipe(gulp.dest('dist/bundle/'));
});
