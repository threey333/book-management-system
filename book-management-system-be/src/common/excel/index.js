// 专门用来处理excel文件的方法 即xlsx

const xlsx = require('node-xlsx').default

// 解析文件或缓冲区
const loadExcel = (path) => {
  return xlsx.parse(path)
}

// 获取解析文件或缓冲区中表的数据，这里默认获取第一张表中的数据
const getFirstSheet = (sheets) => {
  return sheets[0].data
}

module.exports = {
  loadExcel,
  getFirstSheet
}


/**
 *
 * 1.用户选择一个文件
 * 2.服务端得到文件返回key
 * 3.前端再请求对应的业务
 *
*/