const fs = require("fs")

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

readFile("./x.txt")
    .then(function (x) {
        console.log("x")
        return readFile("./y.txt")
    })
    .then(function (y) {
        console.log("y")
        return readFile("./z.txt")
    })
    .then(function (z) {
        console.log("z")
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {
        console.log("finally")
    })
