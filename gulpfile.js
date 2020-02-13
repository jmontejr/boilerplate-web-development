const { src, dest, watch, series, parallel } = require('gulp');
const gclean = require('gulp-clean');
const gsass = require('gulp-sass');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
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

const pathExists = require('path-exists');
const INIT_PATH = './src';
const DEST_PATH = './dist';
const MAP_PATH = '.'


// Swallow error
function swallowError(error) {
    console.log(error.toString());
    this.emit("end");
}

// Clean dist
function cleanDist() {
    return src(DEST_PATH)
        .pipe(gclean());
}

// Task functions
function sass() {
    const plugins = [
        autoprefixer(),
        cssnano()
    ];

    return src(`${INIT_PATH}/assets/scss/style.scss`)
        .pipe(sourcemaps.init())
        .pipe(gsass())
        .on('error', swallowError)
        .pipe(postcss(plugins))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write(MAP_PATH))
        .pipe(dest(`${DEST_PATH}/css`));
}

function html() {
    return src(`${INIT_PATH}/index.html`)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .on('error', swallowError)
        .pipe(dest(DEST_PATH));
}

function image() {
    return src([
        `${INIT_PATH}/images/*.*`,
        `${INIT_PATH}/images/*/*.*`,
        `${INIT_PATH}/images/*/*/*.*`
    ])
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
        .pipe(dest(`${DEST_PATH}/images`));
}

function fonts() {
    return src([
        `${INIT_PATH}/assets/fonts/*.*`,
        `${INIT_PATH}/assets/fonts/*/*.*`,
        `${INIT_PATH}/assets/fonts/*/*.*.*`
    ])
        .pipe(dest(`${DEST_PATH}/fonts`));
}

function scripts() {
    return src([
        `${INIT_PATH}/assets/js/*.js`,
        `${INIT_PATH}/assets/js/*.*.js`
    ])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(`${DEST_PATH}/js`));
}

// Watch files
function watchFiles() {
    watch([
        `${INIT_PATH}/assets/scss/*.scss`,
        `${INIT_PATH}/assets/scss/*/*.scss`
    ], sass);
    watch([
        `${INIT_PATH}/assets/images/*.*`,
        `${INIT_PATH}/assets/images/*/*.*`
    ], image);
    watch(`${INIT_PATH}`, html);
    watch([
        `${INIT_PATH}/assets/js/*.js`,
        `${INIT_PATH}/assets/js/*.*.js`,
        `${INIT_PATH}/assets/js/*/*.js`,
        `${INIT_PATH}/assets/js/*/*.*.js`,
    ], scripts);
}

// define complex tasks
const clean = series(cleanDist);
const develop = parallel(fonts, sass, image, html, scripts);
const build = () => {
    return pathExists.sync(DEST_PATH) ? series(clean, develop) : develop;
}

// export tasks
exports.clean = clean;
exports.dev = series(develop, watchFiles);
exports.default = develop;
exports.build = build();