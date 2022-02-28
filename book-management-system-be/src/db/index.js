require('./schemas/User') // 执行User文件
require('./schemas/InviteCode') // 执行InviteCode文件

const mongoose = require('mongoose')

const connect = () => {
  return new Promise((resolve, reject) => {
    // 连接数据库
    mongoose.connect('mongodb://127.0.0.1:27017/book-mgr', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    // 数据库打开失败的时候输出
    mongoose.connection.on('error', () => {
      reject(new Error('连接数据库失败'))
    });
    // 当数据库被打开的时候，做一些事情
    mongoose.connection.once('open', () => {
      console.log('连接数据库成功')
      resolve()
    })
  })
}

module.exports = {
  connect
}
