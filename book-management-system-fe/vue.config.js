module.exports = {
  assetsDir: 'static', // 放置静态资源的目录
  css: {
    loaderOptions: {
      sass: {
        // sass-loader版本9以上使用的是additionalData
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  }

}
