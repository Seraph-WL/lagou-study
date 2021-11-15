const fs = require("fs")
// 使用 util 模块下面的 promisify 方法将基于回调函数的异步 API 转换成返回Promise 的API
const promisify = require("util").promisify
const readFile = promisify(fs.readFile)

// 异步函数
// 不会阻塞，不在主线程执行，在c++维护的线程执行
async function run() {
    let x = await readFile("./x.txt", "utf-8")
    let y = await readFile("./y.txt", "utf-8")
    let z = await readFile("./z.txt", "utf-8")
    return [x, y, z]
}

run().then(result => console.log(result))

// 异步函数
const fn = async () => {}
