/**
 * Webpack 打包入口文件
 */

// polyfill 会转译所有的 JS 新语法
// import '@babel/polyfill';
import data from './data.json';

// 引入样式文件
import './css/main.css';
import './css/main.less';

console.log(data);

const showMsg = () => {
  // 这个命令就是下一行不报错
  // eslint-disable-next-line
  alert('Hello');
};

// 挂载到全局对象上，这样才能被访问
// eslint-disable-next-line
window.showMsg = showMsg;

const p = new Promise((resolve) => {
  setTimeout(() => {
    console.log('Promise is working');
    resolve();
  }, 1000);
});
console.log(p);
// console.log("Hello Webpack");
