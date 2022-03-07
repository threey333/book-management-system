import httpRequest from '../../config'

class Book {
  constructor () {
    this.bookURL = 'http://localhost:9090/book'
  }

  // 添加书籍
  async add ({ name, price, auth, publishDate, classify, count } = {}) {
    const url = `${this.bookURL}/add`
    const method = 'POST'
    const data = {
      name,
      price,
      auth,
      publishDate,
      classify,
      count
    }
    return await httpRequest({ url, method, data })
  }

  // 获取书籍列表
  async getList ({ page, size, keyword } = {}) {
    const url = `${this.bookURL}/list?page=${page}&size=${size}${keyword ? `&keyword=${keyword}` : ''}`
    return await httpRequest({ url })
  }

  // 删除某本书籍信息
  async remove (id) {
    const url = `${this.bookURL}/${id}`
    const method = 'DELETE'
    return await httpRequest({ url, method })
  }

  async updateCount ({ id, type, num } = {}) {
    const url = `${this.bookURL}/update/count`
    const data = {
      id,
      type,
      num
    }
    const method = 'POST'
    return await httpRequest({ url, data, method })
  }

  async update ({ id, name, price, auth, publishDate, classify } = {}) {
    const url = `${this.bookURL}/update`
    const data = {
      id,
      name,
      price,
      auth,
      publishDate,
      classify
    }
    const method = 'POST'
    return await httpRequest({ url, data, method })
  }
}

export default new Book()
