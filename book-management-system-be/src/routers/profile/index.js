const Router = require('@koa/router')
const mongoose = require('mongoose')
const { verify, getToken } = require('../../common/token')
const { getBody } = require('../../common/utils')

const User = mongoose.model('User')  //获取invitecode集合

const router = new Router({
  prefix: '/profile'
})

router.post('/update/password', async (ctx, next) => {
  const {
    password,
    oldPassword
  } = getBody(ctx)

  const payload = await verify(getToken(ctx))
  const { _id } = payload

  // 查找是否有该用户
  const user = await User.findOne({
    _id
  }).exec()

  if (!user) {
    // 用户不存在
    ctx.response.body = {
      code: 0,
      msg: '用户不存在'
    }
    return
  }
  if (user.password !== oldPassword) {
    // 用户的密码不一致，则无法更改密码
    ctx.response.body = {
      code: 0,
      msg: '密码校验失败'
    }
  } else {
    user.password = password

    await user.save()

    ctx.response.body = {
      code: 1,
      msg: '修改成功'
    }
  }
})

module.exports = router