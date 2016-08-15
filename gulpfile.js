const path    = require('path');
const del     = require('del');
const runSeq  = require('run-sequence');

const gulp          = require('gulp');
const util          = require('gulp-util');
const webserver     = require('gulp-webserver');
const pug           = require('gulp-pug');
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const webFonts      = require('gulp-google-webfonts');

const SOURCE_DIR = path.resolve(__dirname, 'src');
const PUBLIC_DIR = path.resolve(__dirname, 'public');

// External style libraries
const VIEWPORTS_DIR = path.resolve(__dirname, 'node_modules/viewports');
const PURECSS_DIR = path.resolve(__dirname, 'node_modules/purecss-sass/vendor/assets/stylesheets')

const PRODUCTION = !!util.env.production; // Turn undefined into a proper false

const CONFIG = {
  autoprefixer: {
      browsers: ['last 2 versions'],
      cascade: false
  },

  sass: {
    includePaths: [ SOURCE_DIR, VIEWPORTS_DIR, PURECSS_DIR],
    outputStyle: (PRODUCTION) ? 'compressed' : 'nested'
  },

  pug: {
    pretty: !PRODUCTION
  },

  webFonts: {
    fontsDir: '../assets/fonts/',
    cssFilename: 'webfonts.css'
  },

  webserver: {
    host: 'localhost',
    port: 8080,
    livereload: true,
    directoryListing: true,
    open: `http://localhost:8080/views/index.html`
  }
}

gulp.task('clean', () => {
  return del([
    `${PUBLIC_DIR}/views/*`,
    `${PUBLIC_DIR}/styles/*`,
    `${PUBLIC_DIR}/assets/fonts/*`
  ]);
});

gulp.task('build_views', () => {
  return gulp.src(`${SOURCE_DIR}/views/*.pug`)
    .pipe(pug(CONFIG.pug))
    .pipe(gulp.dest(`${PUBLIC_DIR}/views`));
});

gulp.task('build_styles', () => {
  return gulp.src(`${SOURCE_DIR}/styles/*.scss`)
    .pipe(sass(CONFIG.sass).on('error', sass.logError))
    .pipe(autoprefixer(CONFIG.autoprefixer))
    .pipe(gulp.dest(`${PUBLIC_DIR}/styles`));
});

gulp.task('build_fonts', () => {
  return gulp.src(`${SOURCE_DIR}/fonts/fonts.list`)
    .pipe(webFonts(CONFIG.webFonts))
    .pipe(gulp.dest(`${PUBLIC_DIR}/styles`));
})

gulp.task('watch', () => {
  gulp.watch(`${SOURCE_DIR}/**/*.pug`, ['build_views']);
  gulp.watch(`${SOURCE_DIR}/**/*.scss`, ['build_styles']);
  gulp.watch(`${SOURCE_DIR}/fonts/*`, ['build_fonts']);
});

gulp.task('webserver', () => {
  return gulp.src(PUBLIC_DIR)
    .pipe(webserver(CONFIG.webserver));
})

gulp.task('build', () => {
  runSeq('clean',
    ['build_views', 'build_styles', 'build_fonts']
  );
});

gulp.task('dev', ['webserver', 'build', 'watch']);

gulp.task('default', ['build']);
