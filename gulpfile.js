'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function buildStyles() {
  return gulp.src('./client/configs/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/assets/css'));
};

exports.buildStyles = buildStyles;
exports.watch = function () {
  gulp.watch('./client/configs/**/*.scss', ['sass']);
};