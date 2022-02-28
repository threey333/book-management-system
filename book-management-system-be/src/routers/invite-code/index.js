const Router = require('@koa/router')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const { getBody } = require('../../utils')

const InviteCode = mongoose.model('InviteCode')  //获取invitecode集合

const router = new Router({
  prefix: '/invite'
})


router.post('/add', async (ctx, next) => {
  const code = InviteCode({
    code: uuidv4(),
    user: '',
  })
  const saved = await code.save() //保存到数据库中
  ctx.response.body = {
    code: 1,
    data: saved,
    msg: '创建成功'
  }
})


module.exports = router