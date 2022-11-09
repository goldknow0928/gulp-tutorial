'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const fileinclude = require('gulp-file-include');

// path
const paths = {
    styles: {
        src: './src/scss/**/*.scss', //개발용 폴더
        dest: './dist/css' //빌드될 폴더
    },
    html: {
        src: {
            /**
             * 초반 레이아웃 작업시 include 파일 watch
             * 이후에는 include 파일 watch 예외
             */
            pass: './src/html/**/*', //불러올 파일의 위치
            exit: '!' + './src/html/include*' //읽지 않고 패스할 파일의 위치
        },
        dest: './dist/html'
    }
};

// scss compile
function buildStyles() {
    return (
        gulp
        .src(paths.styles.src)
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest(paths.styles.dest))
    );
};
exports.buildStyles = buildStyles;

// include HTML
function includeHTML() {
    return gulp.src([
            paths.html.src.pass,
            //paths.html.src.exit
        ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(paths.html.dest));
}
exports.default = includeHTML;

// watch
exports.watch = function () {
    gulp.watch(paths.styles.src, buildStyles);
    gulp.watch(paths.html.src.pass, includeHTML);
};