/* eslint-disable import/no-extraneous-dependencies */
// 公共配置文件

const { resolve } = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const StylelintPlugin = require('stylelint-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line no-unused-vars
const ESlintPlugin = require('eslint-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const CopyWebpackPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 通用的样式 loader
const commonStyleLoader = [
  // 3. 将 CSS 打包到独立的文件中
  // MiniCssExtractPlugin.loader,
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../',
    },
  },

  // 2. css-loader 按照 CommonJS 规范，将样式文件，输出到 JS 中
  'css-loader',

  // 1. 通过 postcss-loader 给样式属性添加浏览器前缀
  'postcss-loader',
];

module.exports = {
  // 入口文件
  entry: './src/index.js',

  // 出口配置
  output: {
    // 输出目录（输出目录必须是绝对路径）
    path: resolve(__dirname, '../dist'),
    // 输出文件名称
    filename: 'index.js',
  },

  // 模块配置
  module: {
    rules: [
      // 指定多个配置规则
      {
        test: /\.css$/i,
        // use 中 loader 的加载顺序：先下后上
        use: commonStyleLoader,
      },

      {
        test: /\.less$/i,
        // use 中 loader 的加载顺序：先下后上
        use: [...commonStyleLoader, 'less-loader'],
      },

      // 处理图片
      {
        test: /\.(png|gif|jpe?g)$/i,
        // use: {
        //   loader: "url-loader",
        //   options: {
        //     // 指定图片大小，小于该数值的图片，会被转成 base64
        //     limit: 8 * 1024, // 8 kb
        //     // [name] 是图片原来的名称
        //     // [ext] 是图片原来的后缀名
        //     name: "image/[name].[ext]",
        //     // url-loader 默认采用 ES Modules 规范进行解析，但是 html-loader 引入图片使用的是 CommonJS 规范
        //     // 解决：关闭 url-loader 默认的 ES Modules 规范，强制 url-loader 使用 CommonJS 规范进行打包
        //     esModule: false
        //   }
        // }

        // 使用资源模块
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: 'image/[name][ext]',
        },
      },

      // {
      //   test: /\.(htm|html)$/i,
      //   use: {
      //     loader: 'html-loader',
      //     options: {
      //       // Webpack 4 中只需要在 url-loader 配置 esModule: false
      //       // Webpack 5 需要 html-loader 中，也配置 esModule: false
      //       esModule: false
      //     }
      //   }
      // },

      // 匹配字体文件
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/i,
        // use: {
        //   loader: 'file-loader',
        //   options: {
        //     name: 'fonts/[name].[ext]'
        //   }
        // }

        // 使用资源模块处理字体文件
        // asset 可以在 asset/resource 和 asset/inline 之间进行选择
        // 如果文件小于 8kb，则使用 asset/inline 类型
        // 如果文件大于 8kb，则使用 asset/resource 类型
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },

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
                  // core-js 的版本
                  corejs: 3,
                  // targets: "defaults"
                  // 指定兼容浏览器的版本
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

  // 开发服务器
  devServer: {
    // 指定加载内容的路径
    contentBase: resolve(__dirname, 'dist'),

    // 启用 gzip 压缩
    compress: true,

    // 端口号
    port: 9200,

    // 启动自动更新（禁用 hot）
    liveReload: true,
    hot: false,

    // 配置代理：解决接口跨域问题
    proxy: {
      // http://localhost:9200/api
      '/api': {
        // http://localhost:9200/api/users => https://api.github.com/api/users
        target: 'https://api.github.com',
        // http://localhost:9200/api/users => https://api.github.com/users
        pathRewrite: {
          '^/api': '',
        },
        // 不能使用 localhost:9200 作为 github 的主机名
        changeOrigin: true,
      },
    },
  },

  // 配置目标
  target: 'web',

  // 插件配置
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new StylelintPlugin({
      // 指定需要进行格式校验的文件
      files: ['src/css/*.{css,less,sass,scss}'],
    }),

    // new ESLintPlugin({
    //   // 自动解决常规的代码格式报错
    //   fix: true
    // }),
    // 直接将 src 下，不需要特殊处理的文件，直接复制到输出目录中
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/public',
          to: 'public',
        },
      ],
    }),

    // 打包之前，先删除历史文件
    new CleanWebpackPlugin(),
  ],
};
