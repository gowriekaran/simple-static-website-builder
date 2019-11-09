var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var util = require('gulp-util');


gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: '_dev'
        },
    });
});

gulp.task('sass', function () {
    return gulp.src('_dev/assets/scss/**/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('_dev/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('images', function () {
    return gulp.src('_dev/assets/imgs/**/*')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('_prod/assets/imgs'));
});

gulp.task('json', function () {
    return gulp.src('_dev/assets/json/**/*')
        .pipe(gulp.dest('_prod/assets/json'));
});

gulp.task('projects', function () {
    return gulp.src('_dev/projects/**/*')
        .pipe(gulp.dest('_prod/projects'));
});

gulp.task('docs', function () {
    return gulp.src('_dev/assets/docs/**/*')
        .pipe(gulp.dest('_prod/assets/docs'));
});

gulp.task('useref', function () {
    return gulp.src('_dev/index.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .on('error', function (err) {
            util.log(util.colors.red('[Error - uglify]'), err.toString());
        })
        .pipe(gulpIf('*.css', minifyCss()))
        .pipe(gulp.dest('_prod'));
});

gulp.task('clean:_prod', function () {
    return del.sync('_prod');
});

gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('_dev/assets/scss/**/*.scss', ['sass']);
    gulp.watch('_dev/index.html', browserSync.reload);
    gulp.watch('_dev/assets/js/**/*.js', browserSync.reload);
    gulp.watch('_dev/assets/json/**/*.json', browserSync.reload);
});

gulp.task('build', function (callback) {
    runSequence('clean:_prod',
        ['sass', 'useref', 'images', 'json', 'projects', 'docs'],
        callback
    );
});

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    );
});