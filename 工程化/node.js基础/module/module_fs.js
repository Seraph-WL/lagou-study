const fs = require("fs")

// 同步方法，返回结果是数组，包含文件夹中都有哪些内容
const result = fs.readdirSync("./")
// 异步方法
fs.readdir("./", function (error, files) {
    // 有错误输出错误信息，无错null
    console.log(error);
    // 有结果文件名
    console.log(files);
})
