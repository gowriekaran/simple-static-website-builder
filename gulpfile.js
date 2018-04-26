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

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: '_dev'
        },
    })
});

gulp.task('sass', function () {
    return gulp.src('_dev/assets/scss/**/*.scss') // Gets all files ending with .scss in _dev/scss
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('_dev/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('images', function () {
    return gulp.src('_dev/assets/imgs/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('_prod/assets/imgs'))
});

gulp.task('useref', function () {
    return gulp.src('_dev/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', minifyCss()))
        .pipe(gulp.dest('_prod'))
});

gulp.task('clean:_prod', function () {
    return del.sync('_prod');
})

gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('_dev/assets/scss/**/*.scss', ['sass']);
    gulp.watch('_dev/*.html', browserSync.reload);
    gulp.watch('_dev/assets/js/**/*.js', browserSync.reload);
});

gulp.task('build', function (callback) {
    runSequence('clean:_prod',
        ['sass', 'useref', 'images'],
        callback
    )
})

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
})