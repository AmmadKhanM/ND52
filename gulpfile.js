const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rtlcss = require('gulp-rtlcss');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const sourcemaps = require('gulp-sourcemaps');
const jsmin = require('gulp-jsmin');
const connect = require('gulp-connect');
const replace = require('gulp-replace');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const tap = require('gulp-tap');
const fs = require('fs');
const path = require('path');
const merge = require('merge-stream');
const order = require('gulp-order');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const concat = require('gulp-concat');

const localesDir = './src/locales/';

function renderNunjucks() {
    const langs = fs.readdirSync(localesDir).map(file => path.basename(file, '.json'));

    const tasks = langs.map(lang => {
        let stream = gulp.src('src/*.+(html|nunjucks)')
            .pipe(data(function (file) {
                try {
                    const globalData = JSON.parse(fs.readFileSync(localesDir + `${lang}.json`));
                    const specificData = fs.existsSync(localesDir + lang + '/' + path.basename(file.path, '.html') + '.json') ?
                        JSON.parse(fs.readFileSync(localesDir + lang + '/' + path.basename(file.path, '.html') + '.json')) : {};
                    return Object.assign({}, globalData, specificData);
                } catch (error) {
                    console.log(`Could not load data for ${path.basename(file.path, '.html')} in ${lang}`);
                    return {};
                }
            }))
            .pipe(nunjucksRender())
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(replace('script.js', 'script.min.js')) // Replace 'script.js' with 'script.min.js' first
            .pipe(gulp.dest(`dist/${lang}`));

        let streamsToMerge = [];
        if (lang === 'en') {
            let streamEn = stream.pipe(replace('style.css', 'style.min.css'))
                .pipe(replace('assets/', '../assets/'))
                .pipe(gulp.dest(`dist/${lang}`));
            streamsToMerge.push(streamEn);
        }
        if (lang === 'ar') {
            let streamAr = stream.pipe(replace('style.css', 'style-rtl.min.css'))
                .pipe(replace('lang="en"', 'lang="ar"'))
                .pipe(replace('dir="ltr"', 'dir="rtl"'))
                .pipe(replace('assets/', '../assets/'))
                .pipe(gulp.dest(`dist/${lang}`));
            streamsToMerge.push(streamAr);
        }

        return merge(...streamsToMerge);
    });

    return merge(...tasks);
}

function clean() {
    return del(['dist']);
}

function redirectionFile() {
    return new Promise(function (resolve, reject) {
        var fs = require('fs');
        var fileContent = '<html><head><meta http-equiv="refresh" content="0; url=/en" /></head></html>';

        fs.writeFile('./dist/index.html', fileContent, function (err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

// function to copy all folders from src/assets to dist/assets
function copyAssets() {
    return gulp.src('src/assets/**/*')
        .pipe(gulp.dest('dist/assets'));
}

function compileSass() {
    return gulp.src('src/assets/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rtlcss())
        .pipe(rename({ basename: 'style-rtl' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/css'))
}

function compileCritical() {
    return gulp.src('src/assets/scss/critical.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rtlcss())
        .pipe(rename({ basename: 'critical-rtl' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/css'))
}

function minifyCss() {
    return gulp.src(['dist/assets/css/*.css', '!dist/assets/css/*min.css']) // Minify new CSS files in the assets folder
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/css'));
}

function minifyJsQuick() {
    return gulp.src(['src/assets/js/*.js'])
        .pipe(concat('script.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/js'));
}

function minifyJs() {
    return gulp.src(['src/assets/js/*.js'])
        .pipe(concat('script.js'))
        .pipe(jsmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/js'));
}

function minifyPostJs() {
    return gulp.src(['src/assets/post-js/*.js'])
        .pipe(concat('post-script.js'))
        .pipe(jsmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/js'));
}

function minifyPostJsQuick() {
    return gulp.src(['src/assets/post-js/*.js'])
        .pipe(concat('post-script.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/js'));
}

function minifyCriticalJs() {
    return gulp.src(['src/assets/critical-js/*.js'])
        .pipe(concat('critical-script.js'))
        .pipe(jsmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/js'));
}

function minifyCriticalJsQuick() {
    return gulp.src(['src/assets/critical-js/*.js'])
        .pipe(concat('critical-script.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/js'));
}

function reload(done) {
    connect.reload();  // Call connect.reload() to refresh browser after file updates.
    done();
}

function watchFiles() {
    gulp.watch('src/assets/scss/**/*.scss', gulp.series('compileSass', 'minifyCss', reload))
    gulp.watch('src/assets/scss/**/*.scss', gulp.series('compileCritical', 'minifyCss', reload))
    gulp.watch('src/assets/post-js/**/*.js', gulp.series('minifyPostJsQuick', reload))
    gulp.watch('src/assets/js/**/*.js', gulp.series('minifyJsQuick', reload))
    gulp.watch('src/assets/critical-js/**/*.js', gulp.series('minifyCriticalJsQuick', reload))
    gulp.watch('src/**/*.html', gulp.series('nunjucks', reload))
    gulp.watch('src/locales/**/*.json', gulp.series('nunjucks', reload))
}

// function to start a localhost server using the dist folder
function serve(done) {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 8000
    });
    done();
}

// a task that copies all the files from dist folder to prod folder and then changes /../assets/ assets to ../assets/ in all the html files
gulp.task('prod', function () {
    return gulp.src('dist/**/*')
        .pipe(replace('/../assets/', '../assets/'))
        .pipe(replace('"/en"', '"../en"'))
        .pipe(replace('"/ar"', '"../ar"'))
        .pipe(replace('url=/en"', 'url="./en"'))
        .pipe(gulp.dest('prod'));
});

gulp.task('redirectionFile', redirectionFile);
gulp.task('copyAssets', copyAssets);
gulp.task('compileSass', compileSass);
gulp.task('compileCritical', compileCritical);
gulp.task('minifyCss', gulp.series(gulp.parallel('compileSass', 'compileCritical'), minifyCss));
gulp.task('minifyJs', minifyJs);
gulp.task('minifyPostJs', minifyPostJs);
gulp.task('minifyPostJsQuick', minifyPostJsQuick);
gulp.task('minifyJsQuick', minifyJsQuick);
gulp.task('minifyCriticalJs', minifyCriticalJs);
gulp.task('minifyCriticalJsQuick', minifyCriticalJsQuick);
gulp.task('watch', watchFiles);
gulp.task('serve', serve);
gulp.task('reload', reload);
gulp.task('nunjucks', renderNunjucks);

gulp.task('default', gulp.series(clean, 'compileSass', 'compileCritical', 'minifyCss', 'copyAssets', 'minifyJsQuick', 'minifyPostJsQuick', 'minifyCriticalJsQuick', 'nunjucks', 'redirectionFile', 'serve', 'watch'));
gulp.task('prod', gulp.series(clean, 'compileSass', 'compileCritical', 'minifyCss', 'copyAssets', 'minifyJs', 'minifyPostJs', 'minifyCriticalJs', 'nunjucks', 'redirectionFile', 'prod'));