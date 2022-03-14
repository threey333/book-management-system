const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../common/utils')

const Log = mongoose.model('Log')  //获取invitecode集合

const router = new Router({
  prefix: '/log'
})

router.get('/list', async (ctx, next) => {
  let {
    page,
    size
  } = ctx.query

  page = Number(page)
  size = Number(size)

  const query = {}

  const list = await Log
    .find(query)
    .skip((page - 1) * size)
    .limit(size)
    .exec()

  ctx.response.body = {
    code: 1,
    msg: '获取记录列表成功',
    data: list
  }
})




module.exports = router