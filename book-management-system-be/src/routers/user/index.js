const Router = require('@koa/router')
const mongoose = require('mongoose')

const config = require('../../project-config')

const { getBody } = require('../../common/utils')
const { verify, getToken } = require('../../common/token')
const { loadExcel, getFirstSheet } = require('../../common/excel')

const User = mongoose.model('User')  // 获取users集合
const Character = mongoose.model('Character') // 获取character集合

const router = new Router({
  prefix: '/user'
})

// 获取账户列表
router.get('/list', async (ctx, next) => {
  let {
    page,
    size,
    keyword,
  } = ctx.query

  const query = {}
  if (keyword) query.account = keyword

  page = Number(page)
  size = Number(size)

  const list = await User
    .find(query)
    .sort({
      _id: -1
    })
    .skip((page - 1) * size)
    .limit(size)
    .exec()

  const total = await User.countDocuments().exec()

  ctx.response.body = {
    code: 1,
    msg: '获取用户列表成功',
    data: {
      list,
      page,
      size,
      total
    }
  }
})

// 删除用户
router.delete('/:id', async (ctx, next) => {
  const {
    id
  } = ctx.params

  const delMsg = await User.deleteOne({
    _id: id,
  })

  ctx.response.body = {
    code: 1,
    msg: '删除成功',
    data: {
      delMsg,
      id
    }
  }
})

// 添加用户
router.post('/add', async (ctx, next) => {
  const {
    account,
    password,
    character,
  } = getBody(ctx)

  const _isFindCharacter = await Character.findOne({
    _id: character
  })
  if (!_isFindCharacter) {
    // 如果找到角色,则直接返回
    ctx.response.body = {
      code: 0,
      msg: '出错了'
    }
    return
  }

  const user = new User({
    account,
    password: password || config.DEFAULT_PASSWORD,
    character
  })
  const res = await user.save()

  ctx.response.body = {
    code: 1,
    msg: '添加成功',
    data: res
  }
})

// 重置密码为默认密码
router.post('/reset/password', async (ctx, next) => {
  const {
    id
  } = getBody(ctx)

  const user = await User.findOne({
    _id: id
  })

  if (!user) {
    ctx.response.body = {
      code: 0,
      msg: '找不到该用户',
    }
    return
  }

  user.password = config.DEFAULT_PASSWORD

  const res = await user.save()

  ctx.response.body = {
    code: 1,
    msg: '修改成功',
    data: {
      account: res.account,
      _id: res._id
    }
  }
})

// 修改角色
router.post('/update/character', async (ctx, next) => {
  const {
    character,
    userId,
  } = getBody(ctx)

  // 先查找是否有该角色
  const _isFindCharacter = await Character.findOne({
    _id: character,
  }).exec()
  if (!_isFindCharacter) {
    ctx.response.body = {
      code: 0,
      msg: '出错啦',
    }
    return
  }

  // 查找用户
  const user = await User.findOne({
    _id: userId
  }).exec()
  if (!user) {
    ctx.response.body = {
      code: 0,
      msg: '用户不存在',
    }
    return
  }

  user.character = character
  const res = await user.save()
  ctx.response.body = {
    code: 1,
    msg: '修改成功',
    data: res
  }
})

// 获取用户信息(认证体系)
router.get('/info', async (ctx, next) => {
  const token = getToken(ctx) // 获取token

  ctx.response.body = {
    code: 1,
    msg: '获取成功',
    data: await verify(token),
  }
})


// 文件中的数据保存到对应的集合文档中
router.post('/addMany', async (ctx, next) => {
  const { key = '' } = getBody(ctx)
  const path = `${config.UPLOAD_DIR}/${key}` // 上传的文件路径

  const excel = loadExcel(path) // 获取该xlsx文件中的所有sheet
  const sheetData = getFirstSheet(excel) //获取第一个sheet中的数据
  const { length } = sheetData //表中数据的大小

  // 从数据库中获取所有角色数据
  const character = await Character.find({}).exec()
  console.log(character)

  // 从角色中获取 name 是 member的文档数据
  const memberData = character.find(item => item.name === 'member')

  const insertData = [] // 插入多个用户
  for (let i = 0; i < length; i++) {
    const data = sheetData[i]
    const [account, password = config.DEFAULT_PASSWORD] = data

    // 从User集合中查找是否有该用户的数据
    const one = await User.findOne({
      account
    }).exec()

    if (one) continue // 如果存在,则跳过
    insertData.push({
      account,
      password,
      character: memberData._id
    })
  }
  await User.insertMany(insertData)

  ctx.response.body = {
    code: 1,
    msg: '添加账户成功',
    data: {
      addCount: insertData.length,
    },
  }
})


module.exports = router