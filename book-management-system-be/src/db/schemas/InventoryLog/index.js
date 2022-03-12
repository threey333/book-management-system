const mongoose = require('mongoose');
const { getMeta, preSave } = require('../../helper')

const InventoryLogSchema = new mongoose.Schema({
  // 出库还是入库的类型
  type: String,
  // 书名
  name: String,
  // 数量
  num: Number,
  // 用户的id
  user: String,
  // 元信息
  meta: getMeta(),
})

InventoryLogSchema.pre('save', preSave)

mongoose.model('InventoryLog', InventoryLogSchema)