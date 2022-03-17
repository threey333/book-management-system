const Router = require('@koa/router')
const mongoose = require('mongoose')
const { getBody } = require('../../common/utils')
const { BOOK_CONST } = require('../../common/constant')
const config = require('../../project-config')
const { loadExcel, getFirstSheet } = require('../../common/excel')

const Book = mongoose.model('Book')  //创建一个books集合构造函数
const InventoryLog = mongoose.model('InventoryLog') // 创建一个库存集合的构造函数
const BookClassify = mongoose.model('BookClassify')

const findBookOne = async (id) => {
  const one = await Book.findOne({
    _id: id
  }).exec()

  return one
}

const router = new Router({
  prefix: '/book'
})

// 添加图书的接口
router.post('/add', async (ctx, next) => {
  const { name, price, auth, publishDate, classify, count } = getBody(ctx)
  const book = new Book({
    name,
    price,
    auth,
    publishDate,
    classify,
    count
  })
  const res = await book.save()

  ctx.response.body = {
    code: 1,
    msg: '添加成功',
    data: res
  }
})

// 获取图书列表的接口
router.get('/list', async (ctx, next) => {
  const { page = 1, size = 3, keyword } = ctx.query
  const defaultQuery = {}
  // 利用$regex进行模糊匹配
  keyword ? defaultQuery.name = { $regex: new RegExp(keyword) } : defaultQuery

  const list = await Book
    .find(defaultQuery)
    .skip((page - 1) * size)
    .limit(Number(size))
    .exec()

  const total = await Book.countDocuments() //books集合下总条文档数

  ctx.response.body = {
    code: 1,
    msg: '获取列表数据成功',
    data: {
      list,
      total,
      page,
      size
    }
  }
})

// 删除某本图书信息
router.delete('/:id', async (ctx, next) => {
  const { id } = ctx.params

  // 从数据库中删除某本图书信息数据，建议先查找该图书进行信息核对，然后再进行删除
  const findTargetBook = await findBookOne(id)
  if (!findTargetBook && !(findTargetBook._id === id)) return

  const delMsg = await Book.deleteOne({
    _id: id
  })
  const total = await Book.countDocuments() //获取删除后,books集合下总条文档数
  const { ok } = delMsg //去除删除后的状态
  if (ok) {
    ctx.response.body = {
      code: 1,
      msg: '删除成功',
      data: {
        total,
        delMsg
      }
    }
  }
})

// 入库出库
router.post('/update/count', async (ctx, next) => {
  const {
    id,
    type // 类型判断是入库还是出库
  } = getBody(ctx)
  let { num } = ctx.request.body
  num = Number(num)

  const findABook = await findBookOne(id)
  if (!findABook) {
    ctx.response.body = {
      code: 0,
      msg: '没有找到书籍'
    }
    return
  }

  // 如果找到，则判断是入库还是出库
  type === BOOK_CONST.IN ? num = Math.abs(num) : num = -Math.abs(num)
  findABook.count = findABook.count + num

  if (findABook.count < 0) {
    ctx.response.body = {
      code: 0,
      msg: '剩下的量不足以出库',
    }
    return
  }
  const res = await findABook.save()

  const log = new InventoryLog({
    type,
    num: Math.abs(num),
    name: res.name,
  })
  // 出入库操作记录在数据库中
  log.save()

  ctx.response.body = {
    code: 1,
    msg: '操作成功',
    data: res
  }
})

router.post('/update', async (ctx, next) => {
  const {
    id,
    ...args
  } = getBody(ctx)

  const one = await findBookOne(id)

  if (!one) {
    // 没找到书
    ctx.response.body = {
      code: 0,
      msg: '没有找到书籍'
    }
    return
  }

  // 找到书则更新修改过的内容
  const newQuery = {}
  Object.entries(args).forEach(([key, value]) => {
    if (value) newQuery[key] = value
  })
  Object.assign(one, newQuery)

  // 修改过的内容保存到数据库中
  const res = await one.save()
  if (res) {
    ctx.response.body = {
      data: res,
      code: 1,
      msg: '保存成功'
    }
  }

})

router.get('/detail/:id', async (ctx, next) => {
  const { id } = ctx.params
  const one = await findBookOne(id)

  if (!one) {
    // 找不到书籍
    ctx.response.body = {
      code: 0,
      msg: '没有找到书籍'
    }
    return
  }
  // 找到书籍
  ctx.response.body = {
    code: 1,
    data: one,
    msg: '查询成功'
  }
})


// 文件中的数据保存到对应的集合文档中
router.post('/addMany', async (ctx, next) => {
  const { key = '' } = getBody(ctx)
  const path = `${config.UPLOAD_DIR}/${key}` // 上传的文件路径

  const excel = loadExcel(path) // 获取该xlsx文件中的所有sheet
  const sheetData = getFirstSheet(excel) //获取第一个sheet中的数据
  const { length } = sheetData //表中数据的大小

  const insertData = [] // 插入多个用户
  for (let i = 0; i < length; i++) {
    const data = sheetData[i]
    const [name, auth, price, publishDate, classify, count] = data

    let classifyID = classify
    let price_number = Number(price)
    let count_number = Number(count)

    // 从 BookClassify 中查找是否有该分类
    const one = await BookClassify.findOne({
      title: classify
    }).exec()

    if (one) {
      classifyID = one._id
    }
    insertData.push({
      name,
      price: price_number,
      auth,
      publishDate,
      classify: classifyID,
      count: count_number
    })
  }
  await Book.insertMany(insertData)

  ctx.response.body = {
    code: 1,
    msg: '添加书籍成功',
    data: {
      addCount: insertData.length,
    },
  }
})

module.exports = router