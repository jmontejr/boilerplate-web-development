/* GULPFILE PATHS */
const INIT_PATH = './src';
const DEST_PATH = './docs';
const SOURCE_MAP_PATH = '.'
const PATHS = {
    sass: {
        origin: `${ INIT_PATH }/assets/scss/style.scss`,
        dist: `${ DEST_PATH }/assets/css`,
        watch: [
            `${ INIT_PATH }/assets/scss/*.scss`,
            `${ INIT_PATH }/assets/scss/*/*.scss`,
        ]
    },
    html: {
        origin: `${ INIT_PATH }/html/*.html`,
        dist: DEST_PATH,
        include: [
            `${ INIT_PATH }/html/components/*/*.html`,
            `${ INIT_PATH }/html/components/*.html`,
            `${ INIT_PATH }/html/layout/*/*.html`,
            `${ INIT_PATH }/html/layout/*.html`,
        ]
    },
    images: {
        origin: [
            `${ INIT_PATH }/assets/images/*/*/*.*`,
            `${ INIT_PATH }/assets/images/*/*.*`,
            `${ INIT_PATH }/assets/images/*.*`,
        ],
        dist: `${ DEST_PATH }/assets/images`
    },
    fonts: {
        origin: [
            `${ INIT_PATH }/assets/fonts/*/*.*.*`,
            `${ INIT_PATH }/assets/fonts/*/*.*`,
            `${ INIT_PATH }/assets/fonts/*.*`,
        ],
        dist: `${ DEST_PATH }/assets/fonts`
    },
    scripts: {
        origin: [
            './node_modules/tiny-slider/dist/tiny-slider.js',
            `${ INIT_PATH }/assets/js/*/*.*.js`,
            `${ INIT_PATH }/assets/js/*/*.js`,
            `${ INIT_PATH }/assets/js/*.*.js`,
            `${ INIT_PATH }/assets/js/*.js`,
        ],
        dist: `${ DEST_PATH }/assets/js`,
        transpile: `${ DEST_PATH }/assets/js/index.min.js`
    }
};

module.exports = {
    INIT_PATH,
    DEST_PATH,
    SOURCE_MAP_PATH,
    PATHS
};
