const { src, dest, watch, series, parallel } = require('gulp');
const gclean = require('gulp-clean');
const gsass = require('gulp-sass');
const clean_css = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const { gifsicle, mozjpeg, optipng, svgo } = imagemin;
const cache = require('gulp-cache');

const fs = require('fs');
const INIT_PATH = './src/';
const DEST_PATH = './dist/';
const MAP_PATH = './sourcemap/'

function swallowError(error) {
    console.log(error.toString());
    this.emit("end");
}

function cleanDist() {
    return src(DEST_PATH)
        .pipe(gclean());
}

function sass() {
    return src(`${INIT_PATH}assets/scss/style.scss`)
        .pipe(sourcemaps.init())
        .pipe(gsass())
        .pipe(autoprefixer())
        .on('error', swallowError)
        .pipe(clean_css())
        .pipe(sourcemaps.write(MAP_PATH))
        .pipe(dest(`${DEST_PATH}css`));
}

function html() {
    return src(`${INIT_PATH}index.html`)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .on('error', swallowError)
        .pipe(dest(DEST_PATH));
}

function image() {
    return src(['', ''])
        .pipe(cache(imagemin([
            gifsicle({ interlaced: true }),
            mozjpeg({ quality: 75, progressive: true }),
            optipng({ optimizationLevel: 5 }),
            svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ])))
        .on('error', swallowError)
        .pipe(dest(`${DEST_PATH}images`));
}

function fonts() {
    return src([
            `${INIT_PATH}assets/fonts/lato`,
            `${INIT_PATH}assets/fonts/montserrat`    
        ])
        .pipe(dest(`${DEST_PATH}fonts`));
}

function scripts() {
    return src([
            `${INIT_PATH}assets/js/*.js`,
            `${INIT_PATH}assets/js/*.*.js`
        ])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(concat('index.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write(MAP_PATH))
        .pipe(dest(`${DEST_PATH}js`));
}

function watchFiles() {
    watch([
        `${INIT_PATH}assets/scss/*.scss`,
        `${INIT_PATH}assets/scss/*/*.scss`
    ], sass);
    watch([
        `${INIT_PATH}assets/images/*.*`,
        `${INIT_PATH}assets/images/*/*.*`
    ], image);
    watch(`${INIT_PATH}`, html);
    watch([
        `${INIT_PATH}assets/js/*.js`,
        `${INIT_PATH}assets/js/*.*.js`,
        `${INIT_PATH}assets/js/*/*.js`,
        `${INIT_PATH}assets/js/*/*.*.js`,
    ], scripts);
}

const clean = series(cleanDist);
const develop = parallel(fonts, sass, image, html, scripts);
const dist_exist = fs.exists(DEST_PATH, (exists) => exists);

exports.clean = clean;
exports.dev = series(develop, watchFiles);
exports.default = develop;
exports.build = dist_exist ? series(clean, develop) : develop;