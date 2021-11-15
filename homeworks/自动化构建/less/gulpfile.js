const fs = require('fs');

const copyFile = async () => {
    fs.mkdir('dist',{ recursive: true }, (err) => {
        if (err) throw err;
    })
    fs.readFile('styles/main.min.css' , (err,data) => {
        if (err) throw err
        else {
            fs.writeFile('dist/main.min.css', data ,(err) => {
                if (err) throw err;
            });
        }
    });
}

// 导出任务
module.exports = {
    copyFile
}