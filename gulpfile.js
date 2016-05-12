var gulp = require('gulp'),
    jsmin = require('gulp-jsmin'),
    webpack = require('webpack-stream'),
    webpack_config = require('./webpack.config.js'),
    through = require("through2"),
    del = require('del');

gulp.task('default', function() {
    // 删除 gulp-dist 以下的内容
    del.sync(['gulp-dist/**', '!gulp-dist']);

    // webpack打包
    gulp.src('src/index.js')
        .pipe(webpack( webpack_config ))   // 相当于执行了 不带参数的命令 webpack
        .pipe(gulp.dest('gulp-dist/'));

    // 拷贝 lib/
    gulp.src('lib/**',{base:'./'})
        .pipe(jsmin())
        .pipe(gulp.dest('gulp-dist'));

    // 拷贝 index.html
    gulp.src('src/index.html', { base: 'src' })
        .pipe(through.obj(function(file, encode, cb) {
            // 获取内容
            var contents = file.contents.toString(encode);

            // 处理内容

            // 重设内容
            file.contents = new Buffer(contents, encode);
            //回调
            cb(null, file, encode);
        }))
        .pipe(gulp.dest('gulp-dist'));
});

//监听，传入监听对象，目标任务
var watcher = gulp.watch('src/**/*.js', ['default']);
//watch 的时候可以不配置目标任务，而在 事件处理函数中 编写任务。
watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});