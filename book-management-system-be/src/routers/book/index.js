const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../utils')

const Book = mongoose.model('Book')  //创建一个books集合构造函数

const router = new Router({
  prefix: '/book'
})

// 添加图书的接口
router.post('/add', async (ctx, next) => {
  const { name, price, auth, publishDate, classify } = getBody(ctx)
  const book = new Book({ name, price, auth, publishDate, classify })
  const res = await book.save()
  ctx.response.body = {
    code: 1,
    msg: '添加成功',
    data: res
  }
})

// 获取图书列表的接口
router.get('/list', async (ctx, next) => {
  const list = await Book.find({}).exec() //获取books集合下的所有文档数据
  ctx.response.body = {
    code: 1,
    msg: '获取列表数据成功',
    data: list
  }
})

module.exports = router