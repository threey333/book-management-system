const Koa = require('koa')
const koaBody = require('koa-body')
const { connect } = require('./db')
const registerRoutes = require('./routers')
const { middleware: jwtMiddleware, catchTokenError } = require('./common/token')
const { logMiddleware } = require('./common/log')

const cors = require('@koa/cors')

const app = new Koa()

connect().then(() => {
  // 处理跨域
  app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
  }))
  app.use(koaBody({
    multipart: true,  //允许上传文件
    formidable: {
      maxFileSize: 200 * 1024 * 1024   //字段的最大大小
    }
  })) //处理请求体数据的方法

  app.use(catchTokenError)

  app.use(logMiddleware)

  jwtMiddleware(app)

  /**
   * 注册路由
   * @param {Object} Koa的一个实例
  */
  registerRoutes(app)

  app.listen(9090, () => {
    console.log('服务启动成功: http://localhost:9090')
  })
})