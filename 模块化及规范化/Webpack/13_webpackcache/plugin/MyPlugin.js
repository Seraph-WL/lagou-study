// 声明自定义插件
class MyPlugin {
  constructor(options) {
    // eslint-disable-next-line
    console.log('插件配置选项', options)
    this.userOptions = options || {};
  }

  // 必须声明 apply 方法
  apply(compiler) {
    // 在钩子上挂载功能
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // compilation 是此次打包的上下文
      // eslint-disable-next-line
      for (const name in compilation.assets) {
        // eslint-disable-next-line no-console
        console.log(name);
        // 针对 css 文件，执行相关操作
        // if (name.endsWith('.css')) {
        if (name.endsWith(this.userOptions.target)) {
          // 获取处理之前的内容
          const contents = compilation.assets[name].source();
          // 将原来的内容，通过正则表达式，删除注释
          const noComments = contents.replace(/\/\*[\s\S]*?\*\//g, '');
          // 将处理后的结果，替换掉
          // eslint-disable-next-line no-param-reassign
          compilation.assets[name] = {
            source: () => noComments,
            size: () => noComments.length,
          };
        }
      }
    });
  }
}

module.exports = MyPlugin;
