const fs = require("fs")

const promise = new Promise(function (resolve, reject) {
    fs.readFile("./x.txt", "utf-8", function (error, result) {
        if (error) {
            // 将状态从等待变为失败
            reject(error)
        } else {
            // 将状态从等待变为成功
            resolve(result)
        }
    })
})

promise
    .then(function (result) {
        console.log(result)
    })
    .catch(function (error) {
        console.log(error)
    })
