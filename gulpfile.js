import gulp from 'gulp';
const { src, dest, watch, series } = gulp;
import { deleteAsync } from 'del';
import gls from 'gulp-live-server';
import flatten from 'flatten';
// CSS
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import minify from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';

//HTML
import include from 'gulp-file-include';

// other
// import terser from 'gulp-terser';
// import imagemin from 'gulp-imagemin';
// import imagewebp from 'gulp-webp';

function serve() {
  var server = gls.static('dist', 8888);
  server.start();

  watch(['dist/**/*.*'], function (file) {
    server.notify.apply(server, [file]);
  });
}

function html() {
  return src('src/pages/**/**.html')
    .pipe(
      include({
        prefix: '@@',
        basepath: '@root',
      }),
    )
    .pipe(dest('dist'));
}

function images() {
  return src(['src/**/*.svg', 'src/**/*.jpg'])
    .pipe(flatten())
    .pipe(dest('dist/assets/'));
}

function css() {
  return src('src/**/**.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'));
}

function clear() {
  return deleteAsync('dist');
}

const build = series([clear, css, html, images]);
const dev = series([clear, css, html, images, serve]);

export { build, dev };
