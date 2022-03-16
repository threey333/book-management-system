const Router = require('@koa/router')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const InviteCode = mongoose.model('InviteCode')  //获取invitecode集合

const router = new Router({
  prefix: '/invite'
})

router.get('/add', async (ctx, next) => {
  const {
    count,
  } = ctx.request.query

  const arr = []
  for (let i = 0; i < count; i++) {
    arr.push({
      code: uuidv4(),
      user: ''
    })
  }

  const res = await InviteCode.insertMany(arr)

  ctx.response.body = {
    code: 1,
    data: res,
    msg: '创建成功'
  }
})

// 获取所有邀请码
router.get('/list', async (ctx) => {
  let {
    page,
    size,
  } = ctx.request.query;

  page = Number(page);
  size = Number(size);

  const list = await InviteCode
    .find()
    .sort({
      _id: -1,
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec();

  const total = await InviteCode.countDocuments();

  ctx.body = {
    data: {
      list,
      total,
      page,
      size,
    },
    msg: '获取列表成功',
    code: 1,
  }
})

// 删除邀请码
router.delete('/:id', async (ctx) => {
  const {
    id
  } = ctx.params

  const res = await InviteCode.deleteOne({
    _id: id
  }).exec()

  ctx.response.body = {
    code: 1,
    data: res,
    msg: '删除成功'
  }
})

module.exports = router