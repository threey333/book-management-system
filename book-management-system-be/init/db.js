const mongoose = require('mongoose')
const { connect } = require('../src/db/index')
const character = require('../src/common/character')

const { defaultCharacters } = character

// 获取character集合
const Character = mongoose.model('Character')
const User = mongoose.model('User')

connect().then(async () => {
  console.log('开始初始化 角色集合')

  let characterList = await Character.find({})// 先查找是否已经初始化character了，如果已经初始了就不用插入

  if (characterList.length === 0) {
    characterList = await Character.insertMany(defaultCharacters)
  }

  console.log('角色集合 初始化完成')

  const defaultInfo = {
    account: 'admin',
    password: '1234567890'
  }
  const findUser = await User.findOne({
    account: defaultInfo.account
  }).exec()

  if (findUser) {
    // 如果存在则更新，不存在则添加
    await User.updateOne({
      account: findUser.account
    }, {
      $set: defaultInfo
    }).exec()

    console.log('正在更新用户')
  } else {
    const user = new User({
      ...defaultInfo,
      character: characterList.find(item => (item.name === 'admin'))._id
    })

    console.log('正在初始化用户:', user)
    await user.save()
  }

  console.log('用户初始化完成')
})