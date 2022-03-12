import httpRequest from '../../config'
// import { handleLearningRequest } from '../../utils'
class InventoryLog {
  constructor () {
    this.authURL = 'http://localhost:9090/inventory-log'
  }

  // 获取出入库日志数据
  async getInventoryLogList ({ name, type = 'IN_COUNT', page = 1, size = 20 } = {}) {
    const url = `${this.authURL}/list`
    const params = {
      name,
      type,
      page,
      size
    }
    return await httpRequest({ url, params })
  }

  // 更新入出库日志里的图书名字
  async updateLogBookName ({ oldBookName, newBookName }) {
    const url = `${this.authURL}/update`
    const data = {
      oldBookName,
      newBookName
    }
    const method = 'POST'
    return await httpRequest({ url, data, method })
  }
}

export default new InventoryLog()
