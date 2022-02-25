const mongoose = require('mongoose')
const { getMeta } = require('../../helper.js')

/**
 * Schema 映射了MongoDB下的一个集合，并且它的内容就是集合下文档的构成。
 * Model  可以理解成根据Schema生成的一套方法，这套方法用来操作MongoDB下的集合和集合下的文档。
 */

// 这里相当于定义文档各数据的类型
const UserSchema = new mongoose.Schema({
  account: String,
  password: String,
  meta: getMeta()
})

mongoose.model('User', UserSchema)

