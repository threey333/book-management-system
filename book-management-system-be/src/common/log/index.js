const mongoose = require('mongoose')
const { verify, getToken } = require('../token')

const Log = mongoose.model('Log')
const LogResponse = mongoose.model('LogResponse')

/**
 * 这个文件是log操作日志的中间件
 * 
*/
const logMiddleware = async (ctx, next) => {
  // 记录开始的时间
  const startTime = Date.now()

  await next()

  let payload = {} // 用户的有效关键信息
  try {
    payload = await verify(getToken(ctx))
  } catch (error) {
    payload = {
      account: '未知用户',
      id: '',
    }
  }

  const url = ctx.url // 获取请求的路径
  const method = ctx.method  // 获取请求方式
  const status = ctx.status  // 获取状态码

  let responseBody = ''
  if (typeof ctx.body === 'string') {
    // 如果请求体是字符串形式，则直接赋值
    responseBody = ctx.body
  } else {
    try {
      responseBody = JSON.stringify(ctx.body)
    } catch (error) {
      // resquestBody可能既不是字符串也不是对象的数据，那么JSON.stringify就会解析错误，在这里我们捕捉错误
      responseBody = ''
    }
  }

  let show = true
  if (url === '/log/delete') {
    show = false
  }

  // 记录结束的时间
  const endTime = Date.now()

  // 将这些日志操作存入到数据库中
  const log = new Log({
    user: {
      account: payload.account,
      id: payload._id
    },
    request: {
      url,
      method,
      status,
    },
    startTime,
    endTime,
    show,
  })
  log.save()

  const LogRes = new LogResponse({
    logId: log._id,
    data: responseBody
  })
  LogRes.save()
}

module.exports = {
  logMiddleware
}