var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
  return gulp.src(['app/sass/**/*.sass', 'sass/**/*.scss'])
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('css-min', ['sass'], function(){
  return gulp.src('app/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
});

gulp.task('js-concat', function(){
  return gulp.src([
    //список подключаемых библиотек
  ])
  .pipe(concat('libs.js'))
  .pipe(gulp.dest('app/js'));
});

gulp.task('js-min', ['js-concat'], function(){
  var libs = gulp.src('app/js/libs.js')
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/js'));

  var common = gulp.src('app/js/common.js')
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/js'));
});

gulp.task('img', function(){
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBOX: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('watch', ['browser-sync', 'sass', 'js-concat'], function(){
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clean-dist', function(){
  return del.sync('dist');
});

gulp.task('clear', function(){
  return cache.clearAll();
});

gulp.task('build', ['clean-dist', 'img', 'css-min', 'js-min'], function(){
  var buildCss = gulp.src([
      'app/css/main.css',
      'app/css/libs.min.css'
      ])
  .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js/'));

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);