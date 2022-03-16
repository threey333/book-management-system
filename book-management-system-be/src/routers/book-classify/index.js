const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../common/utils')

const BookClassify = mongoose.model('BookClassify')

const router = new Router({
  prefix: '/book-classify',
})

// 获取图书分类
router.get('/list', async (ctx, next) => {
  const list = await BookClassify.find({}).sort({
    _id: -1
  }).exec()

  ctx.body = {
    data: list,
    code: 1,
    msg: '获取图书分类成功',
  }
})

router.post('/add', async (ctx, next) => {
  const {
    title,
  } = getBody(ctx)

  const one = await BookClassify.findOne({
    title
  }).exec()

  if (one) {
    ctx.body = {
      code: 0,
      msg: '书籍分类已经存在',
    };
    return
  }
  // 如果不存在
  const bookClassify = new BookClassify({
    title
  })

  const saved = await bookClassify.save()

  ctx.body = {
    code: 1,
    msg: '创建图书分类成功',
    data: saved
  }
})

router.delete('/:id', async (ctx, next) => {
  const { id } = ctx.params
  const res = await BookClassify.deleteOne({
    _id: id
  }).exec()

  ctx.body = {
    data: res,
    code: 1,
    msg: '删除成功',
  }
})

router.post('/update/title', async (ctx, next) => {
  const {
    id,
    title
  } = getBody(ctx)

  const one = await BookClassify.findOne({
    _id: id,
  })

  if (!one) {
    ctx.body = {
      msg: '资源不存在',
      code: 0,
    };
    return
  }

  one.title = title

  const res = await one.save()

  ctx.body = {
    data: res,
    msg: '修改成功',
    code: 1,
  }
})

module.exports = router;