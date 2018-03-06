var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCSS = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    runSequence = require("run-sequence"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify");

var contributors = ["anthony", "cam", "forrest"];

// Compiles SASS to CSS and outputs it to the /stylesheets/css/ folder
gulp.task("sass-minify", function() {
    for (var i = 0; i < contributors.length; i++) {
        gulp.src(contributors[i] + "/stylesheets/sass/style.scss")
            .pipe(sass().on("error", sass.logError))
            .pipe(autoprefixer({
                browsers: ["last 2 versions"],
                cascade: false
            }))
            .pipe(gulp.dest(contributors[i] + "/stylesheets/css/"))
            .pipe(cleanCSS({compatibility: "ie8"}))
            .pipe(rename({suffix: ".min"}))
            .pipe(gulp.dest(contributors[i] + "/stylesheets/css/"));
    }
});

// Lints the JS code and checks for errors. .jshintrc config can be found in the root dir
gulp.task("jshint-minify", function() {
    for (var i = 0; i < contributors.length; i++) {
        gulp.src(contributors[i] + "/js/*.js")
            .pipe(jshint())
            .pipe(jshint.reporter("default"))
            // .pipe(gulp.dest(contributors[i] + "/js/compiled"))
            .pipe(uglify())
            .pipe(rename({suffix: ".min"}))
            .pipe(gulp.dest(contributors[i] + "/js/compiled/"));
    }
});

// Runs CSS tasks in sequence
gulp.task("css", function(cb) {
    runSequence("sass-minify", cb);
});

// Runs JS tasks in sequence
gulp.task("js", function(cb) {
    runSequence("jshint-minify", cb);
});

// Default Gulp task that runs when called in the command line
gulp.task("default", function(cb) {
    for (var i = 0; i < contributors.length; i++) {
        gulp.watch(contributors[i] + "/stylesheets/sass/*.scss", ["css"], cb);
        gulp.watch(contributors[i] + "/js/*.js", ["js"], cb);
    }
});