var gulp = require('gulp');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var webserver = require('gulp-webserver');


var paths = {
  css: ['./src/big.css'],
  js: ['./src/big.js']
};

gulp.task('quickstart', function () {
  var injectOpts = {
        removeTags: true,
        transform: function (filePath, file) { return file.contents.toString('utf8') }
      },
      css = gulp.src(paths.css).pipe(minifyCss({compatibility: 'ie8'})),
      js = gulp.src(paths.js).pipe(uglify());

  return gulp.src('./src/big.quickstart.html')
    .pipe(inject(css, injectOpts))
    .pipe(inject(js, injectOpts))
    .pipe(gulp.dest('.'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.css, ['quickstart']);
  gulp.watch(paths.js, ['quickstart']);
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['quickstart', 'watch', 'webserver']);