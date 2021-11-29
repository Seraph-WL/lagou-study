module.exports = {
  css: {
    loaderOptions: {
      scss: {
        // @/ 是 src/ 的别名
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData",新版本是additionalData
        // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
        prependData: '@import "~@/styles/variables.scss";'
      }
    }
  }
}
