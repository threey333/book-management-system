const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../common/utils')

const InventoryLog = mongoose.model('InventoryLog')  //获取invitecode集合

const router = new Router({
  prefix: '/inventory-log'
})

router.get('/list', async (ctx, next) => {
  const {
    type,
  } = ctx.query

  let {
    name,
    page,
    size,
  } = ctx.query

  page = Number(page)
  size = Number(size)

  const list = await InventoryLog
    .find({
      name,
      type,
    })
    .sort({
      _id: -1
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec()

  const total = await InventoryLog.find({
    name,
    type,
  }).countDocuments()
    .exec()

  ctx.response.body = {
    code: 1,
    msg: '获取列表成功',
    data: {
      list,
      total,
      page,
      size
    }
  }
})

// 更新出入库日志中的书名
router.post('/update', async (ctx, next) => {
  const {
    oldBookName,
    newBookName,
  } = getBody(ctx)

  const res = await InventoryLog.updateMany({
    name: oldBookName,
  }, { $set: { name: newBookName } }, { multi: true })

  const { ok } = res
  if (ok) {
    ctx.response.body = {
      code: 1,
      msg: '修改日志中的书名成功',
    }
  }
})

module.exports = router