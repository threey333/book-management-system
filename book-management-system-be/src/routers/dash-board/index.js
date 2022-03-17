const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../common/utils')

const User = mongoose.model('User')
const Book = mongoose.model('Book')
const Log = mongoose.model('Log')

const router = new Router({
  prefix: '/dashBoard'
})

router.get('/base-info', async (ctx, next) => {
  const userTotal = await User.countDocuments()
  const bookTotal = await Book.countDocuments()
  const logTotal = await Log.countDocuments()

  ctx.body = {
    code: 1,
    msg: '获取成功',
    data: {
      total: {
        user: userTotal,
        book: bookTotal,
        log: logTotal,
      }
    }
  }
})

module.exports = router