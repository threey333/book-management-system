const mongoose = require('mongoose')
const { getMeta, preSave } = require('../../helper')

const LogResponseSchema = new mongoose.Schema({
  logId: String, // 存这个日志是哪个
  data: String, // 该日志响应的数据

  meta: getMeta(),
})

LogResponseSchema.pre('save', preSave)

mongoose.model('LogResponse', LogResponseSchema)