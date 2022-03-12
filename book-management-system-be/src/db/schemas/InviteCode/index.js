const mongoose = require('mongoose')
const { getMeta, preSave } = require('../../helper')

const InviteCodeSchema = new mongoose.Schema({
  // 邀请码
  code: String,
  // 该邀请码被哪个账户注册了
  user: String,
  meta: getMeta(),
})

InviteCodeSchema.pre('save', preSave)

mongoose.model('InviteCode', InviteCodeSchema)