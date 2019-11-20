var autoprefixer = require("autoprefixer"),
    browserify = require("browserify"),
    browserSync = require("browser-sync").create(),
    buffer = require("vinyl-buffer"),
    cssnano = require("cssnano"),
    del = require("del"),
    glob = require("glob"),
    gulp = require("gulp"),
    htmlmin = require("gulp-htmlmin"),
    postcss = require("gulp-postcss"),
    rename = require('gulp-rename'),
    sass = require("gulp-sass"),
    source = require("vinyl-source-stream"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify");

var paths = {
    temp: {
        css: "_temp/assets/css/",
        img: "_temp/assets/img/",
        js: "_temp/assets/js/",
        root: "_temp/"
    },
    dev: {
        scss: "_dev/assets/scss/*.{scss,sass}",
        img: "_dev/assets/img/*.{png,jpg,jpeg,gif,svg}",
        js: "_dev/assets/js/*.js",
        html: "_dev/*.html"
    },
    prod: {
        css: "_prod/assets/css/",
        img: "_prod/assets/img/",
        js: "_prod/assets/js/",
        root: "_prod/"
    }
};

function reload(done) {
    browserSync.reload();
    done();
}

function clean() {
    return del([paths.temp.root]);
}

function moveHtmlToTemp() {
    return gulp
        .src(paths.dev.html)
        .pipe(gulp.dest(paths.temp.root));
}

function buildJSIntoTemp() {
    var jsFiles = glob.sync(paths.dev.js);
    return (
        browserify({
            entries: jsFiles
        })
        .bundle()
        .pipe(source("script.min.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(paths.temp.js))
    );
}

function compileCSSIntoTemp() {
    return (
        gulp
        .src(paths.dev.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.temp.css))
        .pipe(browserSync.stream())
    );
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "_temp/"
        }
    });
    gulp.watch(paths.dev.scss, compileCSSIntoTemp);
    gulp.watch(paths.dev.js, gulp.parallel(buildJSIntoTemp, reload));
    gulp.watch(paths.dev.html, gulp.parallel(moveHtmlToTemp, reload));
}

function moveHtmlToProd() {
    return gulp
        .src(paths.dev.html)
        .pipe(htmlmin())
        .pipe(gulp.dest(paths.prod.root));
}

function buildJSIntoProd() {
    var jsFiles = glob.sync(paths.dev.js);
    return (
        browserify({
            entries: jsFiles
        })
        .bundle()
        .pipe(source("script.min.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(paths.prod.js))
    );
}

function compileCSSIntoProd() {
    return (
        gulp
        .src(paths.dev.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.prod.css))
        .pipe(browserSync.stream())
    );
}

exports.moveHtmlToTemp = moveHtmlToTemp;
exports.buildJSIntoTemp = buildJSIntoTemp;
exports.compileCSSIntoTemp = compileCSSIntoTemp;
exports.watch = watch;

exports.moveHtmlToProd = moveHtmlToProd;
exports.buildJSIntoProd = buildJSIntoProd;
exports.compileCSSIntoProd = compileCSSIntoProd;

exports.default = gulp.series(clean, gulp.parallel(moveHtmlToTemp, buildJSIntoTemp, compileCSSIntoTemp), watch);
exports.build = gulp.series(gulp.parallel(moveHtmlToProd, buildJSIntoProd, compileCSSIntoProd), clean);