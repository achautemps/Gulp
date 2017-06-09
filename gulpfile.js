var fs = require('fs');
var path = require('path');
var util = require('util');
var stream = require('stream');

//Basic 
var gulp = require('gulp');
var gutil = require('gulp-util');


//Workflow
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();


//
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ts = require('gulp-typescript');





var paths = new function () {
    this.distDir = "../";
    this.srcDir = "../dist";
    this.assetDir = this.srcDir + "";
    this.assetDist = this.distDir + "";
    this.inputs = {
        template: this.srcDir + "/templates",
        scripts: this.assetDir + "/coffee/**/*.coffee",
        ts: this.assetDir + '/ts/**/*.ts',
        styles: this.assetDir + "/scss/**/*.scss",
        images: this.assetDir + "/images/**/*",
    };
    this.outputs = {
        scripts: this.assetDist + "/js",
        styles: this.assetDist + "/css",
        images: this.assetDist + "/images",
        ts: this.assetDist + "/ts-js"
    }
}


gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: paths.distDir,
            directory: true
        },
        browser: "google chrome",
        open: false,
        reloadOnRestart: true,
        //online: true
    });
    gulp.watch(paths.distDir + "/*.html").on('change', browserSync.reload);
    gulp.watch(paths.outputs.scripts + "/**/*.js").on('change', browserSync.reload);
});


gulp.task('scripts-prod', function () {
    return gulp.src('js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('./js/min'))
});

gulp.task('ts', function () {
    return gulp.src(paths.inputs.ts)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(ts({
            noImplicitAny: true,
        }))
        .pipe(gulp.dest(paths.outputs.ts))
        .pipe(notify({
            title: 'Gulp',
            subtitle: 'success',
            message: 'TS compiled'
        }));
});

gulp.task('scripts', function () {

    return gulp.src(paths.inputs.scripts)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(coffee({
                bare: true
            })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest(paths.outputs.scripts))
        .pipe(notify({
            title: 'Gulp',
            subtitle: 'success',
            message: 'Coffee compiled'
        }));
});

gulp.task('images', function () {
    return gulp.src(paths.inputs.images)
        // Pass in options to the task
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(paths.outputs.images));
});

gulp.task('sass', function () {
    return gulp.src(paths.inputs.styles)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.outputs.styles))
        .pipe(notify({
            title: 'Gulp',
            subtitle: 'success',
            message: 'Sass compiled'
        }))
        .pipe(browserSync.stream());
});



gulp.task('watch', function () {
    gulp.watch(paths.inputs.styles, ['sass']);
    gulp.watch(paths.inputs.images, ['images']);
    gulp.watch(paths.inputs.scripts, ['scripts']);
    gulp.watch(paths.inputs.ts, ['ts']);
});

gulp.task('default', ['browser-sync', 'watch']);