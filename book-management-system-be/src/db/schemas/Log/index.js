const mongoose = require('mongoose')
const { getMeta, preSave } = require('../../helper')

const LogSchema = new mongoose.Schema({
  user: {
    id: String,
    account: String
  },

  request: {
    method: String, // 记录http请求的类型 get/post/delete
    url: String,   // 记录访问过的路径
    body: String,  // 记录一些存文本
  },

  meta: getMeta(),
})

LogSchema.pre('save', preSave)

mongoose.model('Log', LogSchema)