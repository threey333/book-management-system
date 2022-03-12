const Router = require('@koa/router')
const mongoose = require('mongoose')

const config = require('../../project-config')

const { getBody } = require('../../common/utils')

const User = mongoose.model('User')  //获取users集合

const router = new Router({
  prefix: '/user'
})

// 获取账户列表
router.get('/list', async (ctx, next) => {
  let {
    page,
    size,
    keyword,
  } = ctx.query

  const query = {}
  if (keyword) query.account = keyword

  page = Number(page)
  size = Number(size)

  const list = await User
    .find(query)
    .sort({
      _id: -1
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec()

  const total = await User.countDocuments().exec()

  ctx.response.body = {
    code: 1,
    msg: '获取用户列表成功',
    data: {
      list,
      page,
      size,
      total
    }
  }
})

// 删除用户
router.delete('/:id', async (ctx, next) => {
  const {
    id
  } = ctx.params

  const delMsg = await User.deleteOne({
    _id: id,
  })

  ctx.response.body = {
    code: 1,
    msg: '删除成功',
    data: {
      delMsg,
      id
    }
  }
})

// 添加用户
router.post('/add', async (ctx, next) => {
  const {
    account,
    password,
  } = getBody(ctx)

  const user = new User({
    account,
    password: password || config.DEFAULT_PASSWORD,
  })
  const res = await user.save()

  ctx.response.body = {
    code: 1,
    msg: '添加成功',
    data: res
  }
})

// 重置密码为默认密码
router.post('/reset/password', async (ctx, next) => {
  const {
    id
  } = getBody(ctx)

  const user = await User.findOne({
    _id: id
  })

  if (!user) {
    ctx.response.body = {
      code: 0,
      msg: '找不到该用户',
    }
    return
  }

  user.password = config.DEFAULT_PASSWORD

  const res = await user.save()

  ctx.response.body = {
    code: 1,
    msg: '修改成功',
    data: {
      account: res.account,
      _id: res._id
    }
  }
})


module.exports = router