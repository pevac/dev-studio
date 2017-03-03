var gulp = require("gulp");
var del = require("del");
var runSequence = require("run-sequence");
var browserSync = require("browser-sync").create();
var argv = require("minimist")(process.argv.slice(2));
var $ = require("gulp-load-plugins")();
var bowerComponent = require("./vendor");
var pngquant = require('imagemin-pngquant');
var events = require('events');
var emitter = new events.EventEmitter();
var currentTask = "";

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
var SOURCE_BASE_DIR = "src";
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
        html: SOURCE_BASE_DIR + "/index.html",
        js: [].concat(bowerComponent, SOURCE_BASE_DIR + "/js/**/*.js"),
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
    zip: {
        src: BUILD_BASE_DIR  + "/**/*.*",
        dest: "./"
    },
    clean: BUILD_BASE_DIR,
};

gulp.task("sass:build", function () {
    currentTask = "sass:build";
    return gulp.src(path.src.styles)
        .pipe($.plumber({errorHandler:  reportError}))
        .pipe($.if(!RELEASE, $.sourcemaps.init()))
        .pipe($.sass())
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.if(RELEASE, $.cssmin()))
        .pipe($.rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe($.if(!RELEASE, $.sourcemaps.write({sourceRoot: './src/sass'})))
        .pipe(gulp.dest(path.build.styles))
        .pipe($.size({title: "styles"}));
});

gulp.task("script:build", function(){
    currentTask = "script:build";
    return gulp.src(path.src.js)
        .pipe($.plumber({errorHandler:  reportError}))
        .pipe($.if(!RELEASE, $.sourcemaps.init()))
        .pipe($.concat("main.js"))
        .pipe($.if(RELEASE,$.uglify()))
        .pipe($.rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe($.if(!RELEASE, $.sourcemaps.write({sourceRoot: './src/js'})))
        .pipe(gulp.dest(path.build.js))
        .pipe($.size({title: "script"}));
});

gulp.task("html:build", function() {
    var appScriptSources = gulp.src([path.build.js + "/**/*.js"]);
    var otherSources = gulp.src([path.build.styles + "/**/*.css"], {read: false});
    var sources = $.merge(otherSources, appScriptSources);
    return gulp.src(path.src.html)
        .pipe($.rigger())
        .pipe($.inject(sources, { ignorePath:"../build/", relative : true }))
        .pipe($.if(RELEASE, $.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: true
        })))
        .pipe(gulp.dest(path.build.html))
        .pipe($.size({title: "index"}));

});

gulp.task("fonts:build", function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('images:build', function () {
    currentTask = "images:build";
    return gulp.src(path.src.img)
        .pipe($.plumber({errorHandler:  reportError}))
        .pipe($.changed(path.build.img))
        .pipe($.cache($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest(path.build.img))
        .pipe($.size({title: "images"}));

});

gulp.task("clean", del.bind(null, path.clean));

gulp.task("build", ["clean"],  function (cb) {
    runSequence(["sass:build", "script:build", "fonts:build","images:build"],"html:build", cb);
});

gulp.task("public",  function (cb) {
    RELEASE = true;
    runSequence("build", cb);
});

gulp.task("del:war", del.bind(null, "./admin.war"));

gulp.task("war",  ["del:war", "public"],  function() {
    return gulp.src(path.zip.src)
        .pipe($.war({
            welcome: "index.html",
            displayName: "Gulp WAR",
        }))
        .pipe($.zip("dev-studio-landing.war"))
        .pipe(gulp.dest(path.zip.dest))
        .pipe($.size({title: "war"}));
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

gulp.task("storm", function (cb) {
    runSequence("build",  "watch", cb);
});

gulp.task("default", ["serve"]);

function reportError(error) {
    var lineNumber = (error.line) ? "LINE " + error.line + " -- " : "";
    var pluginName = (!error.plugin) ? ": ["+error.plugin+"]" : "["+currentTask+"]";
 
    $.notify({
        title: "Task Failed "+ pluginName,
        message: lineNumber + "See console.",
        sound: false
    }).write(error);
 
    var report = "";
    var chalk = $.util.colors.white.bgRed;
 
    report += chalk("TASK:") + pluginName+"\n";
    report += chalk("ERROR:") + " " + error.message + "\n";
    if (error.line) { report += chalk("LINE:") + " " + error.line + "\n"; }
    if (error.file) { report += chalk("FILE:") + " " + error.file + "\n"; }
 
    console.error(report);
    this.emit("end");
}