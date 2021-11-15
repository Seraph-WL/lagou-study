// eslint-disable-next-line
const marked = require('marked');
// 接收webpack.config.js对应的参数 size 20
// eslint-disable-next-line
const { getOptions } = require('loader-utils');

// 导出函数 (建议使用普通函数)
// eslint-disable-next-line func-names
module.exports = function (source) {
  // 获取 loader 的配置项
  // 箭头函数的this代表当前模块，所以不要用箭头函数
  const options = getOptions(this);
  // eslint-disable-next-line no-console
  console.log('my loader', options);

  // return 'my loader'

  // return 'console.log("my loader")'

  const html = marked(source);

  // "<h1 id="关于">关于</h1><p>我是张三</p>"
  // 直接返回，可能因为引号的问题，导致报错
  // return `module.exports = "${html}"`

  // return `module.exports = ${JSON.stringify(html)}`

  // 直接返回 html，交给下一个 loader 进行处理
  return html;
};
