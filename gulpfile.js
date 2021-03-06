var autoprefixer = require("autoprefixer"),
    browserify = require("browserify"),
    browserSync = require("browser-sync").create(),
    buffer = require("vinyl-buffer"),
    concat = require('gulp-concat'),
    cssnano = require("cssnano"),
    del = require("del"),
    glob = require("glob"),
    gulp = require("gulp"),
    htmlmin = require("gulp-htmlmin"),
    postcss = require("gulp-postcss"),
    sass = require("gulp-sass"),
    source = require("vinyl-source-stream"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify");

var paths = {
    dev: {
        css: "_dev/assets/css/*.css",
        html: "_dev/*.html",
        img: "_dev/assets/img/**/*.*",
        js: "_dev/assets/js/*.js",
        json: "_dev/assets/json/*.json",
        projects: "_dev/assets/projects/**/*.*",
        scss: "_dev/assets/scss/*.{scss,sass}",
        video: "_dev/assets/video/**/*.*"
    },
    temp: {
        css: "_temp/assets/css/",
        img: "_temp/assets/img/",
        js: "_temp/assets/js/",
        json: "_temp/assets/json/",
        projects: "_temp/assets/projects/",
        root: "_temp/",
        video: "_temp/assets/video/"
    },
    prod: {
        css: "_prod/assets/css/",
        img: "_prod/assets/img/",
        js: "_prod/assets/js/",
        json: "_prod/assets/json/",
        projects: "_prod/assets/projects/",
        root: "_prod/",
        video: "_prod/assets/video/"
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

function moveCSSToTemp() {
    return gulp
        .src(paths.dev.css)
        .pipe(gulp.dest(paths.temp.css));
}

function compileSCSSIntoTemp() {
    return (
        gulp
        .src(paths.dev.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat("styles.min.css"))
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.temp.css))
        .pipe(browserSync.stream())
    );
}

function moveJSONToTemp() {
    return gulp
        .src(paths.dev.json)
        .pipe(gulp.dest(paths.temp.json));
}

function moveIMGToTemp() {
    return gulp
        .src(paths.dev.img)
        .pipe(gulp.dest(paths.temp.img));
}

function moveVIDEOToTemp() {
    return gulp
        .src(paths.dev.video)
        .pipe(gulp.dest(paths.temp.video));
}

function movePROJECTSToTemp() {
    return gulp
        .src(paths.dev.projects)
        .pipe(gulp.dest(paths.temp.projects));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "_temp/"
        }
    });
    gulp.watch(paths.dev.scss, compileSCSSIntoTemp);
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

function moveCSSToProd() {
    return gulp
        .src(paths.dev.css)
        .pipe(htmlmin())
        .pipe(gulp.dest(paths.prod.css));
}

function compileSCSSIntoProd() {
    return (
        gulp
        .src(paths.dev.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat("styles.min.css"))
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.prod.css))
        .pipe(browserSync.stream())
    );
}

function moveJSONToProd() {
    return gulp
        .src(paths.dev.json)
        .pipe(gulp.dest(paths.prod.json));
}

function moveIMGToProd() {
    return gulp
        .src(paths.dev.img)
        .pipe(gulp.dest(paths.prod.img));
}

function moveVIDEOToProd() {
    return gulp
        .src(paths.dev.video)
        .pipe(gulp.dest(paths.prod.video));
}

function movePROJECTSToProd() {
    return gulp
        .src(paths.dev.projects)
        .pipe(gulp.dest(paths.prod.projects));
}

exports.moveHtmlToTemp = moveHtmlToTemp;
exports.buildJSIntoTemp = buildJSIntoTemp;
exports.moveCSSToTemp = moveCSSToTemp;
exports.compileSCSSIntoTemp = compileSCSSIntoTemp;
exports.moveJSONToTemp = moveJSONToTemp;
exports.moveIMGToTemp = moveIMGToTemp;
exports.moveVIDEOToTemp = moveVIDEOToTemp;
exports.movePROJECTSToTemp = movePROJECTSToTemp;
exports.watch = watch;

exports.moveHtmlToProd = moveHtmlToProd;
exports.buildJSIntoProd = buildJSIntoProd;
exports.moveCSSToProd = moveCSSToProd;
exports.compileSCSSIntoProd = compileSCSSIntoProd;
exports.moveJSONToProd = moveJSONToProd;
exports.moveIMGToProd = moveIMGToProd;
exports.moveVIDEOToProd = moveVIDEOToProd;
exports.movePROJECTSToProd = movePROJECTSToProd;

exports.default = gulp.series(clean, gulp.parallel(moveHtmlToTemp, buildJSIntoTemp, moveCSSToTemp, compileSCSSIntoTemp, moveJSONToTemp, moveIMGToTemp, moveVIDEOToTemp, movePROJECTSToTemp), watch);
exports.build = gulp.series(gulp.parallel(moveHtmlToProd, buildJSIntoProd, moveCSSToProd, compileSCSSIntoProd, moveJSONToProd, moveIMGToProd, moveVIDEOToProd, movePROJECTSToProd), clean);