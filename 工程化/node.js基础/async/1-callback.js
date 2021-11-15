// function B(callback) {
//   setTimeout(function () {
//     callback({ test: "test" })
//   }, 2000)
// }

// function A(result) {
//   console.log(result)
// }

// B(A)

// const fs = require("fs")

// fs.readFile("./1.txt", "utf-8", function (err, result) {
//   console.log(result)
// })

const fs = require("fs")

fs.readFile("./x.txt", "utf-8", function () {
  console.log("x")
  fs.readFile("./y.txt", "utf-8", function () {
    console.log("y")
    fs.readFile("./z.txt", "utf-8", function () {
      console.log("z")
    })
  })
})
