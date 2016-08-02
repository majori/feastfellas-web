const path = require('path');

const gulp      = require('gulp');
const webserver = require('gulp-webserver');
const pug       = require('gulp-pug');
const sass      = require('gulp-sass');

const TEMPLATE_DIR = path.resolve(__dirname, 'src/templates/views');
const STYLE_DIR = path.resolve(__dirname, 'src/styles');
const PUBLIC_DIR = path.resolve(__dirname, 'public');

gulp.task('build_views', () => {
  return gulp.src(TEMPLATE_DIR + '/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(PUBLIC_DIR + '/views'));
});

gulp.task('build_styles', () => {
  return gulp.src(STYLE_DIR + '/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(PUBLIC_DIR + '/styles'));
});

gulp.task('watch', () => {
  gulp.watch(TEMPLATE_DIR + '/**/*.pug', ['build_views']);
  gulp.watch(STYLE_DIR + '/**/*.scss', ['build_styles']);
});

gulp.task('webserver', () => {
  gulp.src(PUBLIC_DIR)
    .pipe(webserver({
      port: 8080,
      livereload: true,
      directoryListing: true,
      open: 'http://localhost:8080/views/index.html'
    }));
})

gulp.task('default', ['webserver','watch']);
