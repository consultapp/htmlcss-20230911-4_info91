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

function js() {
  return src(['src/assets/js/**.js', 'src/components/**/*.js'])
    .pipe(concat('script.js'))
    .pipe(dest('dist/js'));
}

function clear() {
  return deleteAsync('dist');
}

function serve() {
  sync.init({ server: './dist' });

  watch(['src/**/**.html'], series(html)).on('change', sync.reload);
  watch(['src/**/**.scss'], series(css)).on('change', sync.reload);
  watch(['src/assets/images/*'], series(images)).on('change', sync.reload);
  watch(['src/assets/js/**.js', 'src/components/**/*.js'], series(js)).on(
    'change',
    sync.reload,
  );
}

const build = series([clear, css, html, js, images]);
const dev = series([clear, css, html, js, images, serve]);

export { build, dev, images };
