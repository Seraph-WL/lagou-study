const http = require("http")

const server = http.createServer(function (req, res) {
    // request 请求对象,包含请求信息
    // response  响应对象,用于对请求进行响应
    if (req.url === "/") {
        res.write("Hello Node.js")
        res.end()
    }
    if (req.url === "/api/course") {
        res.write(JSON.stringify([1, 2, 3]))
        res.end()
    }
})

server.listen(3000)
console.log("服务器启动成功")
