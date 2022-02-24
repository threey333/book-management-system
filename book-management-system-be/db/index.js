const mongoose = require('mongoose')
const { Schema, model } = mongoose

/**
 * Schema 映射了MongoDB下的一个集合，并且它的内容就是集合下文档的构成。
 * Model  可以理解成根据Schema生成的一套方法，这套方法用来操作MongoDB下的集合和集合下的文档。
 */

// 这里相当于定义文档各数据的类型
const UserSchema = new Schema({
  nickname: String,
  password: String,
  age: Number
})

const UserModel = model('User', UserSchema)

const connect = () => {
  // 连接数据库
  mongoose.connect('mongodb://127.0.0.1:27017/book-mgr')
  // 数据库打开失败的时候输出
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  // 当数据库被打开的时候，做一些事情
  mongoose.connection.once('open', () => {
    console.log('连接成功')
    // 创建文档
    const user = new UserModel({
      nickname: '小杨',
      password: '112233445566',
      age: 18
    })
    // 保存到数据库中
    user.save()
  })
}

connect()
