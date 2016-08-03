const path = require('path');

const gulp          = require('gulp');
const webserver     = require('gulp-webserver');
const pug           = require('gulp-pug');
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');

const SERVER_ADDRESS = 'localhost';
const SERVER_PORT = 8080;

const TEMPLATE_DIR = path.resolve(__dirname, 'src/templates');
const STYLE_DIR = path.resolve(__dirname, 'src/styles');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const BOOTSTRAP_DIR = path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets');

const CONFIG = {
  sass: {
    includePaths: [ STYLE_DIR, BOOTSTRAP_DIR ]
  },

  pug: {
    pretty: true
  },

  webserver: {
    host: SERVER_ADDRESS,
    port: SERVER_PORT,
    livereload: true,
    directoryListing: true,
    open: `http://${SERVER_ADDRESS}:${SERVER_PORT}/views/index.html`
  }
}

gulp.task('build_views', () => {
  return gulp.src(TEMPLATE_DIR + '/views/*.pug')
    .pipe(pug(CONFIG.pug))
    .pipe(gulp.dest(PUBLIC_DIR + '/views'));
});

gulp.task('build_styles', () => {
  return gulp.src(STYLE_DIR + '/**/*.scss')
    .pipe(sass(CONFIG.sass).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(PUBLIC_DIR + '/styles'));
});

gulp.task('watch', () => {
  gulp.watch(TEMPLATE_DIR + '/**/*.pug', ['build_views']);
  gulp.watch(STYLE_DIR + '/**/*.scss', ['build_styles']);
});

gulp.task('webserver', () => {
  return gulp.src(PUBLIC_DIR)
    .pipe(webserver(CONFIG.webserver));
})

gulp.task('build', ['build_views', 'build_styles']);
gulp.task('dev', ['webserver', 'build', 'watch']);
