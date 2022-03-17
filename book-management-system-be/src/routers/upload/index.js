const Router = require('@koa/router')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const config = require('../../project-config')
const { saveFileToDisk, getUploadFileExt } = require('../../common/upload')

const router = new Router({
  prefix: '/upload'
})

// 上传文件，返回前端一个key，key为文件的全名
router.post('/file', async (ctx, next) => {
  const ext = getUploadFileExt(ctx)
  const filename = `${uuidv4()}.${ext}`
  await saveFileToDisk(ctx, path.resolve(config.UPLOAD_DIR, filename))

  ctx.response.body = {
    code: 1,
    msg: '',
    data: filename
  }
})

module.exports = router