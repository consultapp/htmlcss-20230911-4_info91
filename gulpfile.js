import gulp from 'gulp';
const { src, dest, watch, series } = gulp;
import { deleteAsync } from 'del';
import syncServer from 'browser-sync';
import flatten from 'gulp-flatten';
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
const sync = syncServer.create();

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
  return src('src/assets/images/*')
    .pipe(flatten())
    .pipe(dest('dist/assets/images/'));
}

function scss() {
  return src('src/**/**.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/assets/css'));
}
function library() {
  return src('src/library/**.css')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(concat('library.min.css'))
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/assets/css'));
}

const jsSrc = ['src/**/**.js'];
function js() {
  return src(jsSrc).pipe(concat('script.js')).pipe(dest('dist/assets/js'));
}

function clear() {
  return deleteAsync('dist');
}

function serve() {
  sync.init({ server: './dist' });

  watch(['src/**/**.html'], series(html)).on('change', sync.reload);
  watch(['src/**/**.scss'], series(scss)).on('change', sync.reload);
  watch(['src/library/**.css'], series(library)).on('change', sync.reload);
  watch(['src/assets/images/*'], series(images)).on('change', sync.reload);
  watch(jsSrc, series(js)).on('change', sync.reload);
}

const build = series([clear, scss, library, html, js, images]);
const dev = series([clear, scss, library, html, js, images, serve]);

export { build, dev, images };
