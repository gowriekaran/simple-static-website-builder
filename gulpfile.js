var autoprefixer = require("autoprefixer"),
    browserify = require("browserify"),
    browserSync = require("browser-sync").create(),
    buffer = require("vinyl-buffer"),
    cssnano = require("cssnano"),
    gulp = require("gulp"),
    htmlmin = require("gulp-htmlmin"),
    postcss = require("gulp-postcss"),
    sass = require("gulp-sass"),
    source = require("vinyl-source-stream"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify");

var paths = {
    styles: {
        src: "_dev/assets/styles/*.scss",
        dest: "_prod/assets/styles"
    },
    scripts: {
        src: "_dev/assets/scripts/*.js",
        dest: "_prod/assets/scripts"
    },
    html: {
        src: "_dev/*.html",
        dest: "_prod/"
    }
};

function reload() {
    browserSync.reload();
}

function style() {
    return (
        gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
    );
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "_dev/"
        }
    });
    gulp.watch(paths.styles.src, style);
    gulp.watch(paths.html.src, reload);
}

function javascriptBuild() {
    return (
        browserify({
            entries: ["_dev/assets/scripts/index.js"]
        })
        .bundle()
        .pipe(source("_dev/assets/scripts/index.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
    );
}

function htmlBuild() {
    return gulp
        .src(paths.html.src)
        .pipe(htmlmin())
        .pipe(gulp.dest(paths.html.dest));
}

exports.style = style;
exports.watch = watch;
exports.javascriptBuild = javascriptBuild;
exports.htmlBuild = htmlBuild;
exports.build = gulp.parallel(javascriptBuild, htmlBuild, style);
exports.default = watch;