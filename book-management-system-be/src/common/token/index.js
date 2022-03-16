const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')
const config = require('../../project-config')

const getToken = (ctx) => {
  let { authorization } = ctx.header

  return (authorization && authorization.replace('Bearer ', '').replace('bearer ', '')) || ''
}

/**
 * 
 * @param {String} token 
 * @returns 
 */
const verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_PUBLIC_KEY, (err, payload) => {
      if (err) {
        reject(new Error(err))
        return
      }
      resolve(payload)
    })
  })
}

/**
 * 定义一个中间件函数，主要处理哪些路由需要jwt验证，哪些接口不需要验证
 *  @param {Object} koa的实例
 */

const middleware = (app) => {
  app.use(koajwt({
    secret: config.JWT_PUBLIC_KEY
  }).unless({
    path: [
      /^\/auth\/login/,
      /^\/auth\/register/,
      /^\/character\/list/,
      /^\/forget-password\/add/,
    ],
  }))
}

/** 捕捉token的相关错误*/
const catchTokenError = (ctx, next) => {
  return next().catch((error) => {
    if (error.status === 401) {
      ctx.status = 401
      ctx.body = {
        code: 0,
        msg: 'token error'
      }
    } else {
      throw error
    }
  })
}

module.exports = {
  verify,
  getToken,
  middleware,
  catchTokenError,
}