// COMMON
import gulp from 'gulp';
const { src, dest, watch, series } = gulp;

import { deleteAsync } from 'del';
import syncServer from 'browser-sync';
const sync = syncServer.create();

import zip from 'gulp-zip';
import flatten from 'gulp-flatten';
import Pageres from 'pageres';

// STYLE
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import minify from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';

// HTML
import include from 'gulp-file-include';

// IMAGES
import imagemin from 'gulp-imagemin';

// import terser from 'gulp-terser';
// import imagewebp from 'gulp-webp';

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
    .pipe(imagemin())
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
  src('src/assets/images/*sprites.svg')
    .pipe(imagemin())
    .pipe(flatten())
    .pipe(dest('dist/library'));

  return src('src/library/**/**.css')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(concat('library.min.css'))
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/library'));
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

  watch(['src/**/**.html', 'src/**/**.txt'], series(html)).on(
    'change',
    sync.reload,
  );
  watch(['src/**/**.scss'], series(scss)).on('change', sync.reload);
  watch(['src/library/**/**.css'], series(library)).on('change', sync.reload);
  watch(['src/assets/images/*'], series(images)).on('change', sync.reload);

  watch(jsSrc, series(js)).on('change', sync.reload);
}

function archiveLibrary() {
  return gulp
    .src('dist/library/*')
    .pipe(zip('library.zip'))
    .pipe(gulp.dest('dist'));
}

async function sc() {
  deleteAsync('dist/screenshots');
  return await new Pageres({ delay: 2 })
    .source(
      'https://clinquant-dodol-36e9f9.netlify.app/histogram/',
      ['iphone 5s', 'iphone 12', '1280x1024', '1920x1080'],
      { crop: true },
    )
    .source('https://clinquant-dodol-36e9f9.netlify.app/', [
      '375x812',
      '1280x1024',
      '1920x1080',
    ])
    .destination('dist/screenshots')
    .run();
}

const build = series([clear, scss, library, html, js, images, archiveLibrary]);
const dev = series([clear, scss, library, html, js, images, serve]);

export { build, dev, sc };
