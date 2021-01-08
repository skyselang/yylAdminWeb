// https://www.babeljs.cn/
module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset'
  ],
  'env': {
    'development': {
      // babel plugin动态导入节点插件只做一件事，将所有import（）转换为require（）。
      // 当你有大量页面时，这个插件可以显著提高热更新的速度。
      'plugins': ['dynamic-import-node']
    }
  }
}
