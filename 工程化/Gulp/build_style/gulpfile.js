// 通过 解构 的方式引入函数
const { src, dest } = require('gulp')
// 转css
const less = require('gulp-less')
// 压缩
const cleancss = require('gulp-clean-css')
// 重命名
const rename = require('gulp-rename')
// css兼容性
const autoprefixer = require('gulp-autoprefixer')

// 声明 gulp 任务
const style = () => {
  // 流 就是异步操作
  return src('src/styles/main.less', { base: 'src' })
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(cleancss())
    .pipe(rename({ "extname": ".min.css" }))
    .pipe(dest('dist'))
}

// 导出任务
module.exports = {
  style
}