const gulp = require('gulp');
// const babel = require('gulp-babel');
const del = require('del');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const stripDebug = require('gulp-strip-debug');
const gulpif = require('gulp-if');

const jsPath = 'src/js/classes/*.js';

const sourceMap = {
  sourcemaps: process.env.NODE_ENV === 'producion' ? false : true
};

function clean() {
  return del(['resource/dist']);
}

function jQuery() {
  return gulp
    .src('node_modules/jquery/dist/jquery.min.js', sourceMap)
    .pipe(concat('jquery.min.js'))
    .pipe(gulp.dest('resource/dist', false));
}

function common() {
  return gulp
    .src(
      [
        // 'node_modules/jquery/dist/jquery.min.js',
        // 'node_modules/swiper/dist/js/swiper.min.js',
        jsPath,
        'src/js/contents/*.js',
        'src/js/commonJs.js'
      ],
      sourceMap
    )
    .pipe(concat('commonJs.js'))
    .pipe(gulpif(process.env.NODE_ENV === 'producion', stripDebug()))
    .pipe(gulp.dest('resource/dist', sourceMap));
}

function commonMin() {
  return (
    gulp
      .src(
        [
          // 'node_modules/jquery/dist/jquery.min.js',
          // 'node_modules/swiper/dist/js/swiper.min.js',
          jsPath,
          'src/js/contents/*.js',
          'src/js/commonJs.js'
        ],
        sourceMap
      )
      // .pipe(concat('commonJs.min.js'))
      .pipe(concat('commonJs.js'))
      .pipe(gulpif(process.env.NODE_ENV === 'producion', stripDebug()))
      .pipe(uglify())
      .pipe(gulp.dest('resource/dist', sourceMap))
  );
}

function library() {
  return gulp
    .src(
      [
        // 'node_modules/jquery/dist/jquery.min.js',
        // 'node_modules/swiper/dist/js/swiper.min.js',
        'src/js/library/*.js'
      ],
      sourceMap
    )
    .pipe(concat('library.js'))
    .pipe(gulp.dest('resource/dist', false));
}

const compile = gulp.series(clean, jQuery, library, common);

const compileMin = gulp.series(clean, jQuery, library, commonMin);

function watch() {
  compile();

  gulp.watch('src/js/**/*.js', { delay: 50 }, compile);
}

exports.default = watch;

exports.build = compile;

exports.buildMin = compileMin;
