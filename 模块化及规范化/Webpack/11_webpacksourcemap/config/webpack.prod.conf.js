// 生产配置文件

// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require('webpack-merge');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.conf');

const prodWebpackConfig = merge(baseWebpackConfig, {
  // 这里是生产模式对应的配置
  mode: 'production',

  plugins: [
    new webpack.DefinePlugin({
      // 开发环境下的接口地址
      API_BASE_URL: JSON.stringify('http://apiprod.example.com'),
    }),

    // Html 的配置
    new HtmlWebpackPlugin({
      // 指定打包后的文件名称
      filename: 'index.html',

      // 用来指定，生成 HTML 的模板
      template: './src/index.ejs',
      // 指定 HTML 中使用的变量
      title: 'Webpack Demo',
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new HtmlWebpackPlugin({
      // 指定打包后的文件名称
      filename: 'about.html',
      // 用来指定，生成 HTML 的模板
      template: './src/index.ejs',
      // 指定 HTML 中使用的变量
      title: '关于我们',
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),

    // 压缩 CSS
    new OptimizeCssAssetsPlugin(),
  ],
});

module.exports = prodWebpackConfig;
