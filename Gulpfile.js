/*
 * Build scripts
 */

const gulp         = require('gulp');
const postcss      = require('gulp-postcss');
const sass         = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const terser       = require('terser');
const through      = require('through2');
const rename       = require('gulp-rename');

sass.compiler = require('node-sass');

const Terser = () => {
	return through.obj((file, enc, callback) => {
		if (file.isBuffer()) {
			const string = file.contents.toString('utf8');
			const result = terser.minify(string);

			file.contents = 'from' in Buffer ? Buffer.from(result.code) : new Buffer(result.code);

			return callback(null, file);
		}
	});
}

// Compile the core template SCSS
gulp.task('sass', () =>
	gulp.src('./src/scss/mod_discord.scss', { allowEmpty: true })
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./mod_discord/media/css'))
);

gulp.task('postcss', () =>
	gulp.src('./mod_discord/media/css/**/*.css', { allowEmpty: true })
		.pipe(postcss([
			autoprefixer(),
			cssnano()
		]))
		.pipe(gulp.dest('./mod_discord/media/css'))
);

// Copy JS
gulp.task('copy', () =>
    gulp.src('./src/js/mod_discord.js', { allowEmpty: true })
        .pipe(gulp.dest('./mod_discord/media/js'))
);

// Minify JS
gulp.task('minify', () =>
    gulp.src('./src/js/mod_discord.js', { allowEmpty: true })
        .pipe(Terser())
        .pipe(rename({
			suffix: '.min',
			extname: '.js',
		}))
        .pipe(gulp.dest('./mod_discord/media/js'))
);


// Global build task consisting of all sub-tasks
gulp.task('build', gulp.series(
	'sass',
	'postcss',
	'minify',
	'copy',
));
