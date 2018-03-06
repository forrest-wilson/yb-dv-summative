var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCSS = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    runSequence = require("run-sequence"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify");

var contributors = ["anthony", "cam", "forrest"];

gulp.task("sass", function() {
    for (var i = 0; i < contributors.length; i++) {
        gulp.src(contributors[i] + "/stylesheets/style.scss")
            .pipe(sass().on("error", sass.logError))
            .pipe(autoprefixer({
                browsers: ["last 2 versions"],
                cascade: false
            }))
            .pipe(gulp.dest(contributors[i] + "/stylesheets/compiled/"));
    }
});

gulp.task("minify-css", function() {
    for (var i = 0; i < contributors.length; i++) {
        gulp.src(contributors[i] + "/stylesheets/compiled/style.css")
            .pipe(cleanCSS({compatibility: "ie8"}))
            .pipe(rename({suffix: ".min"}))
            .pipe(gulp.dest(contributors[i] + "/stylesheets/compiled/"));
    }
});

gulp.task("jshint", function() {
    for (var i = 0; i < contributors.length; i++) {
        gulp.src(contributors[i] + "/js/*.js")
            .pipe(jshint())
            .pipe(jshint.reporter("default"))
            .pipe(gulp.dest(contributors[i] + "/js/"));
    }
});

gulp.task("uglify", function() {
    for (var i = 0; i < contributors.length; i++) {
        gulp.src(contributors[i] + "/js/*.js")
            .pipe(uglify())
            .pipe(rename({suffix: ".min"}))
            .pipe(gulp.dest(contributors[i] + "/js/compiled/"));
    }
});

gulp.task("css", function(cb) {
    runSequence("sass", "minify-css", cb);
});

gulp.task("js", function(cb) {
    runSequence("jshint", "uglify", cb);
});

gulp.task("default", function(cb) {
    for (var i = 0; i < contributors.length; i++) {
        gulp.watch(contributors[i] + "/stylesheets/*.scss", ["css"], cb);
    }
    
    for (var i = 0; i < contributors.length; i++) {
        gulp.watch(contributors[i] + "/js/*.js", ["js"], cb);
    }
});