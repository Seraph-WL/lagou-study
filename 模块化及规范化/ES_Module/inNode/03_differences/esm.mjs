// 执行命令nodemon --experimental-modules esm.mjs
// ESM 中没有模块全局成员了

// // 加载模块函数
// console.log(require)

// // 模块对象
// console.log(module)

// // 导出对象别名
// console.log(exports)

// // 当前文件的绝对路径
// console.log(__filename)

// // 当前文件所在目录
// console.log(__dirname)

// -------------

// require, module, exports 自然是通过 import 和 export 代替

// __filename 和 __dirname 通过 import 对象的 meta 属性获取
// const currentUrl = import.meta.url
// console.log(currentUrl)

// 通过 url 模块的 fileURLToPath 方法转换为路径
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
console.log(__filename)
console.log(__dirname)


/*
require，module，exports，在ES Module中，没办法使用

因为，这些成员，其实是CommonJS 把我们的模块包装成一个方法后，通过参数提供进来的成员

我们现在使用的是 ESModule，这里加载方式发生了变化，所以就没有上述的几个成员了

所以我们可以通过 import 和 export 代替
*/ 