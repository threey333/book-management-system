const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../common/utils')

const Log = mongoose.model('Log')  //获取invitecode集合

const router = new Router({
  prefix: '/log'
})

// 获取日志列表
router.get('/list', async (ctx, next) => {
  let {
    page,
    size
  } = ctx.query

  console.log(page, size)

  page = Number(page)
  size = Number(size)

  const list = await Log
    .find({
      show: true
    })
    .sort({
      _id: -1
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec()

  const total = await Log.countDocuments().exec();

  ctx.response.body = {
    code: 1,
    msg: '获取记录列表成功',
    data: {
      list,
      page,
      size,
      total
    }
  }
})


// 删除日志
router.post('/delete', async (ctx, next) => {
  const {
    id
  } = getBody(ctx)

  const findOneTargetLog = await Log.findOne({
    _id: id
  }).exec()
  if (!findOneTargetLog) {
    ctx.body = {
      code: 0,
      msg: '删除成功'
    }
    return
  }

  findOneTargetLog.show = false  // false则就隐藏

  await findOneTargetLog.save()
  ctx.body = {
    code: 1,
    msg: '删除成功',
  }
})



module.exports = router