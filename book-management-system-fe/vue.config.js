const webpack = require('webpack')
const path = require('path')
module.exports = {
  assetsDir: 'static', // 放置静态资源的目录
  outputDir: path.resolve(__dirname, '../book-management-system-be/public'),
  css: {
    // requireModuleExtension: true,
    loaderOptions: {
      sass: {
        // sass-loader版本9以上使用的是additionalData
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      },
      less: {
        lessOptions: {
          // strictMath: true,
          // noIeCompat: true,
          javascriptEnabled: true
        }
      }

    }
  },
  configureWebpack: {
    plugins: [
      // 忽略moment.js的所有locale文件
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  }

}
