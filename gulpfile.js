var gulp = require("gulp");
var sass = require("gulp-sass");
var cssmin = require("gulp-cssmin");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require('gulp-sourcemaps');
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var plumber = require("gulp-plumber");
var rigger = require("gulp-rigger");
var del = require("del");
var gulpif = require("gulp-if");
var runSequence = require('run-sequence');
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
var argv = require('minimist')(process.argv.slice(2));

var DEST = './build';  
var RELEASE = !!argv.release;  
var AUTOPREFIXER_BROWSERS = [             
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task("sass", function () {
    return gulp.src("./src/sass/main.scss")
        .pipe(plumber())
        .pipe(gulpif(!RELEASE, sourcemaps.init()))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS,
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(gulpif(!RELEASE, sourcemaps.write(".")))
        .pipe(gulp.dest(DEST +"/css"));
});

gulp.task("script", function(){
    return gulp.src("./src/*.js")
        .pipe(gulpif(!RELEASE, sourcemaps.init()))
        .pipe(rigger())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(gulpif(!RELEASE, sourcemaps.write(".")))
        .pipe(gulp.dest(DEST +"/js"));
});

gulp.task("assets", function() {
    return gulp.src("src/*.html")
        .pipe(rigger())
        .pipe(gulp.dest(DEST))
});


gulp.task("fonts", function() {
    return gulp.src("src/fonts/**/*.*")
        .pipe(gulp.dest(DEST+ "/fonts"));
});


gulp.task("clean", del.bind(null, [DEST]));

gulp.task("build", ["clean"], function (cb) {
    runSequence(["sass", "script" ,"assets", "fonts"], cb);
});

gulp.task("browser-sync", function () {
    browserSync.init({
        server: {
            baseDir: DEST
        }
    });
});

gulp.task("watch", function () {
    gulp.watch("./src/sass/*.sass", ["sass"]);
    gulp.watch("./src/js/*.js", ["script"]);
    gulp.watch("./src/**/*.html",["assets"]);
    gulp.watch("./src/fonts/**/*.*",["fonts"]);
    gulp.watch( DEST + '/**/*.*').on('change', reload);
});

gulp.task("serve", function (cb) {
    runSequence("build",["browser-sync", "watch"] , cb);
});

gulp.task("default", ["serve"]);
