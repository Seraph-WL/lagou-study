// default是关键字 默认导出成员 需要改为其他名字
// import { default as fooName } from './module.js'
// console.log(fooName)

import { name, hello, Person } from './module.js'
console.log(name, hello, Person)
