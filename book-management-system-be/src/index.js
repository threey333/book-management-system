const Koa = require('koa')
const koaBody = require('koa-body')
const { connect } = require('./db')
const registerRoutes = require('./routers')
const koaStatic = require('koa-static')
const { middleware: jwtMiddleware, catchTokenError, checkUser } = require('./common/token')
const { logMiddleware } = require('./common/log')
const { SERVER_PORT } = require('./project-config')
const path = require('path')

const cors = require('@koa/cors')

const app = new Koa()

app.use(koaStatic(path.resolve(__dirname, '../public')))

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

  jwtMiddleware(app)

  app.use(checkUser)

  app.use(logMiddleware)

  /**
   * 注册路由
   * @param {Object} Koa的一个实例
  */
  registerRoutes(app)

  app.listen(SERVER_PORT, () => {
    console.log(`服务启动成功: http://localhost:${SERVER_PORT}`)
  })
})