const Router = require('@koa/router')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { getBody } = require('../../utils')
const { getSecretKey } = require('../../secret-key')

const User = mongoose.model('User')  //获取users集合
const InviteCode = mongoose.model('InviteCode') // 获取invitecodes集合

const router = new Router({
  prefix: '/auth'
})

/**
 * 注册
*/
router.post('/register', async (ctx, next) => {
  const { account, password, inviteCode } = getBody(ctx)
  // 检查账户和密码
  if (account === '' || password === '' || inviteCode === '') {
    ctx.response.body = {
      code: 0,
      msg: '字段不能为空',
      data: null
    }
    return
  }
  // 先从数据库下的invitecodes集合下的文档进行查找，看是否有邀请码
  const findCode = await InviteCode.findOne({
    code: inviteCode
  }).exec()
  if (!findCode || findCode.user) {
    // 如果邀请码不存在或者该邀请码已经被注册使用了
    ctx.response.body = {
      code: 0,
      msg: '邀请码不正确',
      data: null,
    }
    return
  }

  // 查找是否有该用户
  const findUser = await User.findOne({
    account
  }).exec()  //exec返回的是一个promise实例

  if (findUser) {
    ctx.response.body = {
      code: 0,
      msg: '已存在该用户',
      data: null
    }
  } else {
    // 创建一个用户，并将注册的信息保存到数据库中
    const user = new User({
      account,
      password,
    })
    const res = await user.save()
    findCode.user = res._id  //如果创建用户成功，则该邀请码下的user标记为该用户，表示该邀请码已被注册使用。
    findCode.meta.updatedAt = new Date().getTime() //更新邀请码被注册使用的时间
    await findCode.save() // 更新之后还要保存到数据库

    // 将结果返回给用户
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
router.post('/login', async (ctx, next) => {
  const { account, password } = getBody(ctx)
  // 检查账户和密码
  if (account === '' || password === '') {
    ctx.response.body = {
      code: 0,
      msg: '字段不能为空',
      data: null
    }
  }
  // 检查是否有该用户
  const one = await User.findOne({ account }).exec()
  // 采用非对称加密，所以获取私钥
  const privateKey = await getSecretKey('private')
  if (!one) {
    ctx.response.body = {
      code: 0,
      msg: '用户名或密码错误',
      data: null,
    }
    return
  } else {
    // 存在该用户
    const userData = {
      _id: one._id,
      account: one.account,
      character: one.character,
    }
    if (password === one.password) {
      ctx.response.body = {
        code: 1,
        msg: '登录成功',
        data: {
          ...userData,
          token: jwt.sign({ userData }, privateKey, { algorithm: 'RS256' })
        }
      }
    } else {
      ctx.response.body = {
        code: 0,
        msg: '用户名或密码错误',
        data: null
      }
    }
  }
})

module.exports = router