var gulp = require('gulp');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var webserver = require('gulp-webserver');


var paths = {
  css: ['./src/big.css'],
  js: ['./src/big.js'],
  jsmd: ['./src/marked.min.js','./src/big.js']
};

var injectOpts = {
  removeTags: true,
  transform: function (filePath, file) { return file.contents.toString('utf8') }
};

gulp.task('quickstart', function () {
  return gulp.src(['./src/big.quickstart.html'])
    .pipe(inject(gulp.src(paths.css).pipe(minifyCss()), injectOpts))
    .pipe(inject(gulp.src(paths.js).pipe(uglify()), injectOpts))
    .pipe(gulp.dest('.'));
});

gulp.task('quickstart_md', function () {
  return gulp.src(['./src/big.quickstart_md.html'])
    .pipe(inject(gulp.src(paths.css).pipe(minifyCss()), injectOpts))
    .pipe(inject(gulp.src(paths.jsmd).pipe(uglify()), injectOpts))
    .pipe(gulp.dest('.'));
});


// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.css, ['quickstart', 'quickstart_md']);
  gulp.watch(paths.js, ['quickstart', 'quickstart_md']);
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: false,
      directoryListing: true,
      open: true
    }));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['quickstart', 'quickstart_md']);
gulp.task('serve', ['quickstart', 'quickstart_md', 'watch', 'webserver']);