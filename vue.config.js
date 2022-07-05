const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 配置项目启动地址
    host: 'localhost',
    open: true
  }
})
