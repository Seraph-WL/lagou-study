const gulp = require('gulp')

// 创建 gulp 任务
// 新版gulp要求使用异步方式运行
// 回调函数是异步的一种，流，promise也是
const task1 = (cb) => {
  console.log('Task 1 is running')
// 异步
  cb()
}

const task2 = (cb) => {
  console.log('Task 2 is running')

  cb()
}

// 旧版声明任务的语法
gulp.task('task3', (cb) => {
  console.log('Task 3 is running')

  cb()
})

// 导出任务
module.exports = {
  task1,
  default: task2 // 默认任务
}