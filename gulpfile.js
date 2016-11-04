var gulp = require("gulp");
var jshint = require("gulp-jshint");
var del = require("del");
var runSequence = require("run-sequence");
var browserSync = require("browser-sync").create();
var argv = require("minimist")(process.argv.slice(2));
var $ = require("gulp-load-plugins")();

var RELEASE = !!argv.release;  
var AUTOPREFIXER_BROWSERS = [             
    "ie >= 10",
    "ie_mob >= 10",
    "ff >= 30",
    "chrome >= 34",
    "safari >= 7",
    "opera >= 23",
    "ios >= 7",
    "android >= 4.4",
    "bb >= 10"
];
var path = {
    build: { 
        html: "build/",
        js: "build/js/",
        styles: "build/css/",
        fonts: "build/fonts/",
        img: "build/img/"
    },
    src: { 
        html: "src/*.html", 
        js: "src/js/[^_]*.js",
        styles: "src/sass/*.scss",
        fonts: "src/fonts/**/*.*",
        img: "src/img/**/*.*"
    },
    watch: { 
        html: "src/**/*.html",
        js: "src/js/**/*.js",
        styles: "src/sass/**/*.scss",
        fonts: "src/fonts/**/*.*",
        img: "src/img/**/*.*",
        reload: "build/**/*.*"
    },
    clean: "./build", 
    dest: "./build" 
};

gulp.task("sass:build", function () {
    return gulp.src(path.src.styles)
        .pipe($.plumber())
        .pipe($.if(!RELEASE, $.sourcemaps.init()))
        .pipe($.sass())
        .pipe($.autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS,
            cascade: false
        }))
        .pipe($.if(RELEASE, $.cssmin()))
        .pipe($.rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe($.if(!RELEASE, $.sourcemaps.write(".")))
        .pipe(gulp.dest(path.build.styles));
});

gulp.task("script:build", function(){
    return gulp.src(path.src.js)
        .pipe($.if(!RELEASE, $.sourcemaps.init()))
        .pipe($.rigger())
        .pipe(jshint()) 
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe($.concat('main.js'))
        .pipe($.uglify())
        .pipe($.rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe($.if(!RELEASE, $.sourcemaps.write(".")))
        .pipe(gulp.dest(path.build.js));
});

gulp.task("assets:build", function() {
    return gulp.src(path.src.html)
        .pipe($.rigger())
        .pipe(gulp.dest(path.build.html))
});

gulp.task("fonts:build", function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task("clean", del.bind(null, path.clean));

gulp.task("build", ["clean"], function (cb) {
    runSequence(["sass:build", "script:build","assets:build", "fonts:build"], cb);
});

gulp.task("browser-sync", function () {
    browserSync.init({
        server: {
            baseDir: path.dest
        }
    });
    browserSync.watch(path.watch.reload).on("change", browserSync.reload);
});

gulp.task("watch", function(){
    $.watch([path.watch.html], function(event, cb) {
        gulp.start("assets:build");
    });
  
    $.watch([path.watch.styles], function(event, cb) {
        gulp.start("sass:build");
    });

    $.watch([path.watch.js], function(event, cb) {
        gulp.start("script:build");
    });

    $.watch([path.watch.fonts], function(event, cb) {
        gulp.start("fonts:build");
    });

});

gulp.task("serve", function (cb) {
    runSequence("build", ["browser-sync","watch"], cb);
});

gulp.task("default", ["serve"]);
