// 引入 gulp
// const gulp = require('gulp')
// 通过 解构 的方式引入函数
const { src, dest } = require('gulp')

// 声明 gulp 任务
const style = () => {
  // 流 就是异步操作
  // src相当于readfile读文件
  // dest 目标
  // base 参考文件夹，执行后dist文件夹也会建一个styles文件夹
  // return gulp.src('src/styles/main.less', { base: 'src' }).pipe(gulp.dest('dist'))
  return src('src/styles/main.less', { base: 'src' }).pipe(dest('dist'))
}

// 导出任务
module.exports = {
  style
}