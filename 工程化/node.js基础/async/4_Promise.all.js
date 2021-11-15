const fs = require("fs")

// fs.readFile("./x.txt", "utf-8", function (error, x) {
//     fs.readFile("./y.txt", "utf-8", function (error, y) {
//         fs.readFile("./z.txt", "utf-8", function (error, z) {
//             console.log(x)
//             console.log(y)
//             console.log(z)
//         })
//     })
// })

function readFile(path) {
    return new Promise(function (resovle, reject) {
        fs.readFile(path, "utf-8", function (error, result) {
            if (error) {
                reject(error)
            } else {
                resovle(result)
            }
        })
    })
}

Promise.all([
    readFile("./x.txt"),
    readFile("./y.txt"),
    readFile("./z.txt")
]).then(function (result) {
    console.log(result)
})
