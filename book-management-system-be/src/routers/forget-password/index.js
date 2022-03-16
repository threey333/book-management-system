const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../common/utils')
const config = require('../../project-config.js')

const ForgetPassword = mongoose.model('ForgetPassword')  //获取invitecode集合
const User = mongoose.model('User')

const router = new Router({
  prefix: '/reset-password'
})

// 获取忘记密码的信息列表
router.get('/list', async (ctx, next) => {
  let {
    page,
    size,
  } = ctx.query

  page = Number(page)
  size = Number(size)

  // 将status为1的都找出来，因为这些都是没处理
  const forgetPasswordList = await ForgetPassword
    .find({
      status: 1,
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec()

  const total = await ForgetPassword.find({
    status: 1,
  })
    .countDocuments()
    .exec()

  ctx.body = {
    code: 1,
    msg: '获取重置密码列表成功',
    data: {
      list: forgetPasswordList,
      page,
      size,
      total,
    }
  }
})


// 添加忘记密码的账户
router.post('/add', async (ctx, next) => {
  const {
    account
  } = getBody(ctx)

  // 情况一：账户得存在
  const user = await User.findOne({
    account
  }).exec()

  if (!user) {
    ctx.response.body = {
      code: 1,
      msg: '申请成功啦',
    }
    return
  }

  // 情况二：在forget-password 集合中查看该账户是否是待处理,即status为1.
  const one = await ForgetPassword.findOne({
    account,
    status: 1
  }).exec()

  if (one) {
    ctx.response.body = {
      code: 1,
      msg: '申请成功啦'
    }
    return
  }

  // 情况三：该账户存在同时在forget-password 集合中没有记录，即新数据，此时先该集合插入该文档
  const forgetPWD = new ForgetPassword({
    account,
    status: 1
  })

  await forgetPWD.save()

  ctx.body = {
    code: 1,
    msg: '申请成功啦',
  };
})

// 更新处理的状态
router.post('/update/status', async (ctx, next) => {
  let {
    id,
    status
  } = getBody(ctx)

  status = Number(status)

  const one = await ForgetPassword.findOne({
    _id: id
  })
  if (!one) {
    ctx.response.body = {
      code: 0,
      msg: '找不到这条申请'
    }
    return
  }

  // status 可能会2 或者是 3.
  one.status = status
  if (status === 2) {
    const user = await User.findOne({
      account: one.account
    }).exec()

    console.log(user)
    if (!user) return
    user.password = config.DEFAULT_PASSWORD
    await user.save()
  }

  await one.save()

  ctx.response.body = {
    code: 1,
    msg: '处理成功'
  }
})


module.exports = router