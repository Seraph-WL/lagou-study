// 不能省略扩展名.js
// import { name } from './module'
// import { name } from './module.js'
// console.log(name)

// 必须手动填写完整路径 打包时可以省略扩展名，完整路径默认文件操作
// import { lowercase } from './utils'
// import { lowercase } from './utils/index.js'
// console.log(lowercase('HHH'))

// 相对路径中./网络开发中可省略，import中不可 不加会以为引入第三方模块
// import { name } from 'module.js'
// import { name } from './module.js'
// 绝对路径也可
// import { name } from '/04-import/module.js'
// 完整url
// import { name } from 'http://localhost:3000/04-import/module.js'
// console.log(name)

// --------------

// 只会加载模块，不会提取成员 导入一下不需要外界控制的子功能模块会非常有用
// import {} from './module.js'
// import './module.js'

// ---------------

// 提取所有成员并存到一个对象中
// import * as mod from './module.js'
// console.log(mod)

// ---------------

// var modulePath = './module.js'
// import { name } from modulePath
// console.log(name)

// if (true) {
//   import { name } from './module.js'
// }

// 上两个方法不行，动态导入模块 返回promise
// import('./module.js').then(function (module) {
//   console.log(module)
// })

// ----------------

// import { name, age, default as title } from './module.js'
// abc默认成员
import abc, { name, age } from './module.js'
console.log(name, age, abc)
