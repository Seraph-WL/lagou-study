const url = "http://www.example.com";

function log(message) {
    console.log(message);
}

// 文件完整路径包含文件名字
console.log(__filename)
// 文件路径，不带文件名字
console.log(__dirname)

// 简写形式
// exports.url = url
// exports.log = log

// console.log(module);
// 模块导出
module.exports.url = url;
module.exports.log = log;


// 错误写法，使用 exports 对象添加导出成员时不能修改引用地址
exports = {
    endPoint: url,
    log: log
}