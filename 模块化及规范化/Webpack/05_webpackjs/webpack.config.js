/**
 * Webpack 的配置文件
 */
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { default: postcss } = require('postcss');
const StylelintPlugin = require('stylelint-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESlintPlugin = require('eslint-webpack-plugin');

module.exports = {
  // 打包模式
  mode: 'development',
  // 入口文件
  entry: './src/index.js',
  // 出口配置
  output: {
    // 输出目录（输出目录必须是绝对路径）
    path: resolve(__dirname, 'dist'),
    // 输出文件名称
    filename: 'main.js',
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
          'css-loader',

          // 1、通过 postcss-loader 给样式属性添加浏览器前缀
          'postcss-loader',
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
          'css-loader',

          // 2、通过 postcss-loader 给样式属性添加浏览器前缀
          'postcss-loader',

          // 1、将less转成普通的css
          'less-loader',
        ],
      },
      {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      // 按需加载
                      useBuiltIns: 'usage',
                      // core-js 版本
                      corejs: 3,
                      // targets: "defaults"
                      // 可以指定兼容浏览器的版本
                      targets: {
                        chrome: '58',
                        ie: '9',
                        firefox: '60',
                        safari: '10',
                        edge: '17',
                      },
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
  // 开发服务器
  devServer: {},
  // 插件配置
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new StylelintPlugin({
      // 指定需要进行格式校验的文件
      files: ['src/css/*.{css,less,sass,scss}'],
    }),
    // 压缩 css
    new OptimizeCssAssetsPlugin(),
    // 可以打包多个HTML
    new HtmlWebpackPlugin({
      // 指定打包后的文件名称
      filename: 'index.html',
      // 用来指定，生成 HTML 的模板
      template: './src/index.html',
      // 指定 HTML 中使用的变量
      title: 'Webpack Demo',
    }),
    new HtmlWebpackPlugin({
      // 指定打包后的文件名称
      filename: 'about.html',
      // 用来指定，生成 HTML 的模板
      template: './src/index.html',
      // 指定 HTML 中使用的变量
      title: '关于我们',
      // 压缩关于我们的HTML文件
      minify: {
        // 折叠空格
        collapseWhitespace: true,
        keepClosingSlash: true,
        // 删除HTML中的一些注释
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new ESlintPlugin({
      // 自动解决常规的代码格式报错
      fix: true,
    }),
  ],
};
