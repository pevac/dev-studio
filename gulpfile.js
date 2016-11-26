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
// var DEPLOYMENT_NAME = "bionic_dev_studio";
var SOURCE_BASE_DIR = "src/main/ui";
var TARGET_DIR = "build";
var BUILD_BASE_DIR = TARGET_DIR;
var PROXY_PATHS = BUILD_BASE_DIR;


var path = {
    build: { 
        html: BUILD_BASE_DIR,
        js: BUILD_BASE_DIR + "/js",
        styles: BUILD_BASE_DIR + "/css",
        fonts: BUILD_BASE_DIR + "/fonts",
        img: BUILD_BASE_DIR + "/img"
    },
    src: { 
        html: SOURCE_BASE_DIR + "/*.html",
        js: [
            "./bower_components/jquery/dist/jquery.js",
            "./bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js",
            "./bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js",
            "./bower_components/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js",
            "./bower_components/jquery-validation/dist/jquery.validate.js",
            "./bower_components/jquery.maskedinput/dist/jquery.maskedinput.js",
            SOURCE_BASE_DIR + "/js/**/*.js"],
        jshint:  SOURCE_BASE_DIR + "/js/**/*.js",
        styles: SOURCE_BASE_DIR + "/sass/*.scss",
        fonts: SOURCE_BASE_DIR + "/fonts/**/*.*",
        img: SOURCE_BASE_DIR + "/img/**/*.*"
    },
    watch: { 
        html: SOURCE_BASE_DIR + "/**/*.html",
        js: SOURCE_BASE_DIR + "/js/**/*.js",
        styles: SOURCE_BASE_DIR + "/sass/**/*.scss",
        fonts: SOURCE_BASE_DIR + "/fonts/**/*.*",
        img: SOURCE_BASE_DIR + "/img/**/*.*",
        reload: BUILD_BASE_DIR + "/**/*.*"
    },
    clean: BUILD_BASE_DIR,
};

gulp.task("sass:build", function () {
    return gulp.src(path.src.styles)
        .pipe($.plumber())
        .pipe($.if(!RELEASE, $.sourcemaps.init()))
        .pipe($.sass())
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.if(RELEASE, $.cssmin()))
        .pipe($.rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe($.if(!RELEASE, $.sourcemaps.write({sourceRoot: './src/sass'})))
        .pipe(gulp.dest(path.build.styles));
});

gulp.task("accets:build", function () {
    return gulp.src("src/main/ui/js/**/*.json")
        .pipe(gulp.dest(path.build.js));
});

gulp.task("script:build", function(){
    return gulp.src(path.src.js)
        .pipe($.if(!RELEASE, $.sourcemaps.init()))
        .pipe($.concat("main.js"))
        .pipe($.if(RELEASE,$.uglify()))
        .pipe($.rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe($.if(!RELEASE, $.sourcemaps.write({sourceRoot: './src/js'})))
        .pipe(gulp.dest(path.build.js));
});

gulp.task("jshint:build", function(){
    return gulp.src(path.src.jshint)
        .pipe(jshint()) 
        .pipe(jshint.reporter("jshint-stylish"))
});

gulp.task("js:build", function (cb) {
    runSequence("jshint:build", "script:build", cb);
});



gulp.task("html:build", function() {
    return gulp.src(path.src.html)
        .pipe($.rigger())
        .pipe($.if(RELEASE, $.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: true
        })))
        .pipe(gulp.dest(path.build.html))
});

gulp.task("fonts:build", function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('image:build', function () {
   return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
});

gulp.task("clean", del.bind(null, path.clean));

gulp.task("build", ["clean"],  function (cb) {
    runSequence(["sass:build", "accets:build", "js:build","html:build", "fonts:build","image:build"], cb);
});

gulp.task("browser-sync", function () {
    browserSync.init({
        server: {
            baseDir: PROXY_PATHS
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
        gulp.start("js:build");
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

gulp.task("storm", function (cb) {
    runSequence("build",  "watch", cb);
});

gulp.task("default", ["serve"]);
