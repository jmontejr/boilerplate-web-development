const { src, dest, watch, series, parallel } = require('gulp');
const fileinclude = require('gulp-file-include');
const $ = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const composer = require('gulp-uglify/composer');
const uglifyes = require('uglify-es');
const uglify = composer(uglifyes, console);
const browserSync = require('browser-sync').create();

const pathExists = require('path-exists');
const INIT_PATH = './src';
const DEST_PATH = './docs';
const SOURCE_MAP_PATH = '.'
const PATHS = {
    sass: {
        task: `${ INIT_PATH }/assets/scss/style.scss`,
        watch: [
            `${ INIT_PATH }/assets/scss/*.scss`,
            `${ INIT_PATH }/assets/scss/*/*.scss`,
        ]
    },
    html: `${ INIT_PATH }/html/*.html`,
    include: [
        `${ INIT_PATH }/html/components/*/*.html`,
        `${ INIT_PATH }/html/components/*.html`,
        `${ INIT_PATH }/html/layout/*/*.html`,
        `${ INIT_PATH }/html/layout/*.html`,
    ],
    images: [
        `${ INIT_PATH }/assets/images/*/*/*.*`,
        `${ INIT_PATH }/assets/images/*/*.*`,
        `${ INIT_PATH }/assets/images/*.*`,
    ],
    fonts: [
        `${ INIT_PATH }/assets/fonts/*/*.*.*`,
        `${ INIT_PATH }/assets/fonts/*/*.*`,
        `${ INIT_PATH }/assets/fonts/*.*`,
    ],
    scripts: [
        './node_modules/tiny-slider/dist/tiny-slider.js',
        `${ INIT_PATH }/assets/js/*/*.*.js`,
        `${ INIT_PATH }/assets/js/*/*.js`,
        `${ INIT_PATH }/assets/js/*.*.js`,
        `${ INIT_PATH }/assets/js/*.js`,
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
        .pipe($.clean());
}

// Clear cache
function clearCache(done) {
    return $.cache.clearAll(done);
}

function reload(done) {
    browserSync.reload();
    done();
}

function server(done) {
    browserSync.init({
      server: {
        baseDir: DEST_PATH
      },
    });
    done();
}

// Task functions
function sass() {
    const plugins = [
        autoprefixer(),
        cssnano()
    ];

    return src(PATHS.sass.task)
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .on('error', swallowError)
        .pipe($.postcss(plugins))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.sourcemaps.write(SOURCE_MAP_PATH))
        .pipe(dest(`${ DEST_PATH }/assets/css`));
}

function html() {
    return src(PATHS.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .on('error', swallowError)
        .pipe(dest(DEST_PATH));
}

function image() {
    return src(PATHS.images)
        .pipe($.cache($.imagemin([
            $.imagemin.mozjpeg({ quality: 75, progressive: true }),
            $.imagemin.optipng({ optimizationLevel: 5 }),
            $.imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ])))
        .on('error', swallowError)
        .pipe(dest(`${ DEST_PATH }/assets/images`));
}

function fonts() {
    return src(PATHS.fonts)
        .pipe(dest(`${ DEST_PATH }/assets/fonts`));
}

function transpileES() {
    return browserify({
        entries: [`${ DEST_PATH }/assets/js/index.min.js`]
    })
        .transform(babelify.configure({
            presets: ['@babel/env']
        }))
        .bundle()
        .on('error', swallowError)
        .pipe(source('index.min.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init())
        .pipe(uglify())
        .on('error', swallowError)
        .pipe($.sourcemaps.write(SOURCE_MAP_PATH))
        .pipe(dest(`${ DEST_PATH }/assets/js`));
}

function scripts() {
    return src(PATHS.scripts)
        .pipe($.concat('index.js'))
        .pipe($.rename({ suffix: '.min' }))
        .pipe(dest(`${ DEST_PATH }/assets/js`))
        .on('finish', transpileES);
}

// Watch files
function watchFiles() {
    watch(PATHS.sass.watch, series(sass, reload));
    watch(PATHS.images, series(image, reload));
    watch([...PATHS.include, PATHS.html], series(html, reload));
    watch(PATHS.scripts, series(scripts, reload));
}

// define complex tasks
const clean = series(cleanDist);
const develop = parallel(fonts, sass, image, html, scripts);
const build = () => {
    return pathExists.sync(DEST_PATH) ? series(clean, develop) : develop;
}

// export tasks
exports.clean = clean;
exports.cache = series(clearCache);
exports.watch = series(watchFiles);
exports.dev = series(develop, server, watchFiles);
exports.default = develop;
exports.build = series(clearCache, build());
