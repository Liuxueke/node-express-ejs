/**
 * Created by yangxiaoyang on 2017/5/12.
 */

const gulp = require('gulp');
const livereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync =require('browser-sync');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');
const cached = require('gulp-cached');

const path = {
  sass:["assets/style/**/*.scss"],
  css:['public/css/**/*']
};

gulp.task('build',function(){
  gulp.src(path.sass)
    .pipe(cached('sass-task'))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 Chrome versions','Safari >0','Explorer >0' ,'Edge >0','Opera >0','Firefox >= 0','Android >= 0'],
      cascade: false,
      remove:false
    }))
    .pipe(livereload({stream:true}))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('public/css/'));
});
gulp.task('css',function (){
  gulp.src(path.css)
    .pipe(cached('css-task'))
    .pipe(gulp.dest('public/css'));
});
gulp.task('style',function(){
  gulp.src(path.sass)
    .pipe(cached('sass-task'))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 Chrome versions','Safari >0','Explorer >0' ,'Edge >0','Opera >0','Firefox >= 0','Android >= 0'],
      cascade: false,
      remove:false
    }))
    .pipe(livereload({stream:true}))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('browser-sync',['nodemon'],function(){
  browserSync.init(null,{
    proxy: 'http://localhost:5510',
    files: ['public/**/*.*','views/**','router/s_index.js'],
    browser: 'chrome',
    notify: false,
    port: 8080
  });
});
gulp.task('nodemon',function(cd){
  var called = false;
  return nodemon({
    script: './app.js',
    ignore: ['node_modules/','views/**','public/**','assets/**','bin/**']
  }).on('start',function(){
    if(!called){
      cd();
      called = true
    }
  });
});
gulp.task('watch',function(){
  /*livereload.listen();*/
  gulp.watch('assets/style/**/*',['style']);
});

gulp.task('dev',['watch','browser-sync','style']);
