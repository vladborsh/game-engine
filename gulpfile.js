var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var clean = require('gulp-clean');

gulp.task('clean', function() {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
})

gulp.task('concat', ['clean'], function() {
  return gulp.src('src/*.js')
    .pipe(concat('g-light.js'))
    .pipe(gulp.dest('dist'));
})

gulp.task('minify', ['concat'], function() {
  return gulp.src('dist/*.js')
    .pipe(minify({
      ext:{
        min:'.min.js'
      }
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('default', ['clean', 'concat', 'minify']);