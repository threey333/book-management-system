const Router = require('@koa/router')
const mongoose = require('mongoose')

const User = mongoose.model('User')  //获取users集合

const router = new Router({
  prefix: '/auth'
})

/**
 * 注册
*/
router.post('/register', async (ctx, next) => {
  const { account, password } = ctx.request.body
  // 查找是否有该用户
  const isHadOne = await User.findOne({
    account
  }).exec()  //exec返回的是一个promise实例

  if (isHadOne) {
    ctx.response.body = {
      code: 0,
      msg: '已存在该用户',
      data: null
    }
  } else {
    // 如果没有该用户则将注册的信息保存到数据库中
    const user = new User({
      account,
      password,
    })
    const res = await user.save()

    ctx.response.body = {
      code: 1,
      msg: '注册成功',
      data: res
    }
  }
  return
})

/**
 * 登录
*/
router.post('login', async (ctx, next) => {

})

module.exports = router