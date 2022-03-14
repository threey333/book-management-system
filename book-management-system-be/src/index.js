const Koa = require('koa')
const koaBody = require('koa-body')
const { connect } = require('./db')
const registerRoutes = require('./routers')
const { middleware: jwtMiddleware, catchTokenError } = require('./common/token')

const cors = require('@koa/cors')

const app = new Koa()

connect().then(() => {
  // 处理跨域
  app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
  }))
  app.use(koaBody()) //处理请求体数据的方法

  app.use(catchTokenError)

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