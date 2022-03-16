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
    status: Number, // 状态码
  },

  startTime: Number, // 开始时间
  endTime: Number, // 结束时间

  show: Boolean,  // 用来处理日志是否展示在页码中

  meta: getMeta(),
})

LogSchema.pre('save', preSave)

mongoose.model('Log', LogSchema)