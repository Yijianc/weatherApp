/**
 * Created by Boyce on 2016/4/22.
 */

var gulp = require('gulp'),
    del = require('del'),
    //runSequence = require('run-sequence'),
    $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/,
    lazy: true,
    camelize: true
});

gulp.task('haml', function () {
    gulp.src('app/haml/*.haml')
        .pipe($.rubyHaml())
        .pipe(gulp.dest('app'))
        .pipe($.livereload());
})

gulp.task('styles', function () {
    return $.rubySass('app/sass/*.sass')
        .pipe($.autoprefixer())
        .pipe($.cssbeautify())
        .pipe(gulp.dest('app/css'))
        .pipe($.livereload());
});

gulp.task('lint', function () {
    gulp.src('app/js/*.js')
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
        .pipe($.livereload());
});

gulp.task('watch', function () {
    $.livereload.listen();
    gulp.watch('app/haml/*.haml', ['haml']);
    gulp.watch('app/sass/*.sass', ['styles']);
    gulp.watch('app/js/*.js', ['lint']);
});

gulp.task('clean', function (cb) {
    del(
        ['dist', '.sass-cache', 'node_modules'],
        cb
    );
});

gulp.task('default', ['lint', 'haml', 'styles', 'watch']/*, function (cb) {
    runSequence(
        'haml',
        ['styles', 'lint'],
        cb
    );
}*/);