const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../common/utils')

const Character = mongoose.model('Character')  //获取invitecode集合

// prefix - 设置路由前缀
const router = new Router({
  prefix: '/character'
})

router.get('/list', async (ctx, next) => {
  const list = await Character.find({}).exec()

  ctx.response.body = {
    code: 1,
    msg: '获取角色列表成功',
    data: list,
  }
})

module.exports = router