const mongoose = require('mongoose');
const { getMeta } = require('../../helper')

const BookSchema = new mongoose.Schema({
  // 书名
  name: String,
  // 价格
  price: Number,
  // 作者
  auth: String,
  // 出版日期
  publishDate: String,
  // 分类
  classify: String,
  // 库存
  count: Number,
  // 元信息
  meta: getMeta(),
})

mongoose.model('Book', BookSchema)