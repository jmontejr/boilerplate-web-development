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
const fileinclude = require('gulp-file-include');

const pathExists = require('path-exists');
const INIT_PATH = './src';
const DEST_PATH = './dist';
const MAP_PATH = '.'

const PATHS = {
    sass: {
        task: `${INIT_PATH}/assets/scss/style.scss`,
        watch: [
            `${INIT_PATH}/assets/scss/*.scss`,
            `${INIT_PATH}/assets/scss/*/*.scss`
        ]
    },
    html: `${INIT_PATH}/*.html`,
    include: [
        `${INIT_PATH}/includes/*.html`,
        `${INIT_PATH}/includes/*/*.html`
    ],
    images: [
        `${INIT_PATH}/assets/images/*.*`,
        `${INIT_PATH}/assets/images/*/*.*`,
        `${INIT_PATH}/assets/images/*/*/*.*`
    ],
    fonts: [
        `${INIT_PATH}/assets/fonts/*.*`,
        `${INIT_PATH}/assets/fonts/*/*.*`,
        `${INIT_PATH}/assets/fonts/*/*.*.*`
    ],
    scripts: [
        `${INIT_PATH}/assets/js/*.js`,
        `${INIT_PATH}/assets/js/*.*.js`,
        `${INIT_PATH}/assets/js/*/*.js`,
        `${INIT_PATH}/assets/js/*/*.*.js`,
    ]
};


// Swallow error
function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
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

    return src(PATHS.sass.task)
        .pipe(sourcemaps.init())
        .pipe(gsass())
        .on('error', swallowError)
        .pipe(postcss(plugins))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write(MAP_PATH))
        .pipe(dest(`${DEST_PATH}/assets/css`));
}

function html() {
    return src(PATHS.html)
        .pipe(fileinclude({
            prefix: '@@'
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .on('error', swallowError)
        .pipe(dest(DEST_PATH));
}

function image() {
    return src(PATHS.images)
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
        .pipe(dest(`${DEST_PATH}/assets/images`));
}

function fonts() {
    return src(PATHS.fonts)
        .pipe(dest(`${DEST_PATH}/assets/fonts`));
}

function scripts() {
    return src(PATHS.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('index.js'))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write(MAP_PATH))
        .pipe(dest(`${DEST_PATH}/assets/js`));
}

// Watch files
function watchFiles() {
    watch(PATHS.sass.watch, sass);
    watch(PATHS.images, image);
    watch(PATHS.html, html);
    watch(PATHS.scripts, scripts);
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