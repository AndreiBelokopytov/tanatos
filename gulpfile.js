'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const connect = require('gulp-connect')
const autoprefixer = require('gulp-autoprefixer')
const del = require('del')
const useref = require('gulp-useref')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const htmlminify = require('gulp-html-minify')
const cssnano = require('gulp-cssnano')
const gulpif = require('gulp-if')
const lazypipe = require('lazypipe')

const SRC_ROOT = './app'
const DEST_ROOT = './build'

const paths = {
  src: {
    root: SRC_ROOT,
    html: `${SRC_ROOT}/*.html`,
    js: `${SRC_ROOT}/js/**/*.js`,
    sass: `${SRC_ROOT}/scss/**/*.scss`,
    img: `${SRC_ROOT}/img/**/*.*`,
    fonts: `${SRC_ROOT}/fonts/**/*.*`
  },
  dest: {
    root: DEST_ROOT,
    js: `${DEST_ROOT}/js`,
    css: `${DEST_ROOT}/css`,
    img: `${DEST_ROOT}/img`,
    fonts: `${DEST_ROOT}/fonts`
  }
}

const prodMode = (process.env.NODE_ENV === 'production')

if (prodMode) {
  console.log('=== production build ===')
} else {
  console.log('=== development build ===')
}

let jsProductionPipe = lazypipe()
  .pipe(() => {
    return gulpif('*.js', uglify())
  })
  .pipe(() => {
    return gulpif('*.html', htmlminify())
  })

gulp.task('clean', () => {
  return del(paths.dest.root)
})

gulp.task('build:sass', () => {
  return gulp.src(`${paths.src.root}/scss/style.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: ['./node_modules'] }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpif(prodMode, cssnano()))
    .pipe(gulpif(!prodMode, sourcemaps.write()))
    .pipe(gulp.dest(paths.dest.css))
})

gulp.task('build:js', () => {
  return gulp.src(paths.src.html)
    .pipe(useref({}, lazypipe().pipe(sourcemaps.init)))
    .pipe(gulpif(prodMode, jsProductionPipe()))
    .pipe(gulpif(!prodMode, sourcemaps.write()))
    .pipe(gulp.dest(paths.dest.root, {buffer: true}))
})

gulp.task('copy:img', () => {
  return gulp.src(paths.src.img)
    .pipe(gulp.dest(paths.dest.img))
})

gulp.task('copy:fonts', () => {
  return gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.dest.fonts))
})

gulp.task('copy', gulp.parallel('copy:img', 'copy:fonts'))

gulp.task('watch:sass', () => {
  return gulp.watch(paths.src.sass, gulp.parallel('build:sass'))
})

gulp.task('watch:html', () => {
  return gulp.watch(paths.src.html, gulp.parallel('build:js'))
})

gulp.task('watch:img', () => {
  return gulp.watch(paths.src.img, gulp.parallel('copy:img'))
})

gulp.task('watch:js', () => {
  return gulp.watch(paths.src.js, gulp.parallel('build:js'))
})

gulp.task('watch:fonts', () => {
  return gulp.watch(paths.src.fonts, gulp.parallel('copy:fonts'))
})

gulp.task('watch', gulp.parallel('watch:html', 'watch:img', 'watch:sass', 'watch:fonts', 'watch:js'))

gulp.task('build', gulp.series('clean', gulp.parallel('build:sass', 'build:js', 'copy')))
