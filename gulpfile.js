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
        jshint: "src/js/*.js",
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
        .pipe($.csscomb())
        .pipe($.if(RELEASE,$.cssmin()))
        .pipe($.if(!RELEASE, $.sourcemaps.write()))
        .pipe($.rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(gulp.dest(path.build.styles));
});

gulp.task("script:build", function(){
    return gulp.src(path.src.js)
        .pipe($.rigger())
        .pipe($.if(!RELEASE, $.sourcemaps.init()))
        .pipe($.uglify())
        .pipe($.rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe($.if(!RELEASE, $.sourcemaps.write(".")))
        .pipe(gulp.dest(path.build.js));
});

gulp.task("jshint:build", function(){
    return gulp.src(path.src.jshint)
        .pipe(jshint()) 
        .pipe(jshint.reporter("jshint-stylish"))
});

gulp.task("html:build", function() {
    return gulp.src(path.src.html)
        .pipe($.rigger())
        .pipe(gulp.dest(path.build.html))
});

gulp.task("fonts:build", function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        // .pipe($.imagemin({ 
        //     progressive: true,
        //     svgoPlugins: [{removeViewBox: false}],
        //     interlaced: true, 
        //     optimizationLevel: 3 
        // }))
        .pipe(gulp.dest(path.build.img)) 
});

gulp.task("clean", del.bind(null, path.clean));

gulp.task("build", ["clean"], function (cb) {
    runSequence(["sass:build", "script:build","html:build", "fonts:build","image:build"], cb);
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
        gulp.start("html:build");
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

      $.watch([path.watch.img], function(event, cb) {
        gulp.start("image:build");
    });
});

gulp.task("serve", function (cb) {
    runSequence("build", ["browser-sync","watch"], cb);
});

gulp.task("default", ["serve"]);
