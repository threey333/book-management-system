const fs = require('fs')

/**
 * 保存文件到硬盘中
 * 
 * @param {上下文} ctx 
 * @param {文件名} filename 
 */
const saveFileToDisk = (ctx, filename) => {
  return new Promise((resolve, reject) => {
    const file = ctx.request.files.file// 获取读取的文件
    const readerStream = fs.createReadStream(file.path) // 创建可读流
    const writeStream = fs.createWriteStream(filename) // 创建可写流
    // 将readerStream中的所有数据通过管道传输到 filename 的文件中
    readerStream.pipe(writeStream)

    // 当流中没有更多数据可供消费时，则会触发 'end' 事件
    readerStream.on('end', () => {
      resolve(filename)
    })

    // 如果流出现故障,抛出错误
    readerStream.on('error', (err) => {
      reject(new Error(err))
    })
  })
}

// 获取文件的后缀名
const getUploadFileExt = (ctx) => {
  const { name = '' } = ctx.request.files.file
  return name.split('.').pop()
}

module.exports = {
  saveFileToDisk,
  getUploadFileExt,
}