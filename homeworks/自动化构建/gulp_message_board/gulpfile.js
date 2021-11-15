// 通过 解构 的方式引入函数
const { src, dest, parallel, series, watch } = require('gulp')
// 压缩css
const cleancss = require('gulp-clean-css');
// 重命名
const rename = require('gulp-rename');
// 压缩html
const htmlmin = require('gulp-htmlmin');
// 压缩js
const uglify = require('gulp-uglify');
// ES6转ES5
const babel = require('gulp-babel');
// css兼容
const autoprefixer = require('gulp-autoprefixer');
// less转css
// const less = require('gulp-less');
// 删除
const del = require('del');
// 服务
const browserSync = require('browser-sync');

// 创建服务
const bs = browserSync.create();



// 声明 gulp 任务
const style = () => {
    // 流 就是异步操作
    return src('src/css/index.css', { base: 'src' })
      .pipe(autoprefixer())
      .pipe(cleancss())
      .pipe(rename({ "extname": ".min.css" }))
      .pipe(dest('dist/styles'))
}
  
// 声明 脚本 构建任务
const script = () => {
    return src('src/js/index.js')
      .pipe(babel({
        presets: ['babel-preset-env']
      }))
      .pipe(uglify())
      .pipe(rename({ "extname": ".min.js" }))
      .pipe(dest('dist/scripts'))
}
// 引用第三方
const script3 = () => {
    return src('src/js/js_3/*.js')
      .pipe(dest('dist/scripts'))
}
  
// 声明 页面 的构建任务
const html = () => {
    return src('src/index.html')
      .pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }))
      .pipe(dest('dist'))
}

// 声明 文件清除 任务
const clean = () => {
    return del(['dist'])
}


// 声明 服务发布 任务
const serve = () => {
    // watch(被监视的文件，对应的任务)
    watch('src/index.html', html)
    watch('src/css/index.css', style)
    watch('src/js/index.js', script)
  
    // 初始化服务
    bs.init({
        notify: false,      // 禁用 浏览器 右上角的 browserSync connected 提示框
        files: 'dist/**',   // 监视 dist 下 文件的变化，然后在浏览器上实时更新
        server: {
            baseDir: './dist', // 指定服务启动的目录
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}
  
// parallel 并行
// 组合任务
const build = parallel(style, script, script3, html);
// series串行
const dev = series(clean, build, serve);

// 导出任务
module.exports = {
    style,
    script,
    html,
    serve,
    build,
    dev
}