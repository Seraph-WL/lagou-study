/**
 * Webpack 的配置文件
 */
const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { default: postcss } = require("postcss");
const StylelintPlugin = require("stylelint-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // 打包模式
  mode: "development",
  // 入口文件
  entry: "./src/index.js",
  // 出口配置
  output: {
    // 输出目录（输出目录必须是绝对路径）
    path: resolve(__dirname, "dist"),
    // 输出文件名称
    filename: "main.js",
  },
  // 模块配置
  module: {
    rules: [
      // 指定多个配置规则
      {
        test: /\.css$/i,
        // use 中 loader 的加载顺序：先下后上
        use: [
          // 3、将 JS 中的样式，挂载到 <style> 标签中
          // 'style-loader',

          // 3、将 css 打包到独立的文件中
          MiniCssExtractPlugin.loader,

          // 2、css-loader 按照 CommonJS 规范，将样式文件，输出到 JS 中
          "css-loader",

          // 1、通过 postcss-loader 给样式属性添加浏览器前缀
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/i,
        // use 中 loader 的加载顺序：先下后上
        use: [
          // 4、将 JS 中的样式，挂载到 <style> 标签中
          // 'style-loader',

          // 4、将 css 打包到独立的文件中
          MiniCssExtractPlugin.loader,

          // 3、css-loader 按照 CommonJS 规范，将样式文件，输出到 JS 中
          "css-loader",

          // 2、通过 postcss-loader 给样式属性添加浏览器前缀
          "postcss-loader",

          // 1、将less转成普通的css
          "less-loader",
        ],
      },
    ],
  },
  // 开发服务器
  devServer: {},
  // 插件配置
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new StylelintPlugin({
      // 指定需要进行格式校验的文件
      files: ["src/css/*.{css,less,sass,scss}"],
    }),
    // 压缩 css
    new OptimizeCssAssetsPlugin()
  ],
};
