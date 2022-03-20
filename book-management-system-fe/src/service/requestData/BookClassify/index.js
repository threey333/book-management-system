import httpRequest from '../../config'
import { domain } from '../../utils'
class BookClassify {
  constructor () {
    this.bookclassifyURL = `${domain}/book-classify`
  }

  // 获取图书分类列表
  async bookClassifyList () {
    const url = `${this.bookclassifyURL}/list`
    return await httpRequest({ url })
  }

  // 添加图书分类
  async addBookClassifyList ({ title } = {}) {
    const url = `${this.bookclassifyURL}/add`
    const method = 'POST'
    const data = {
      title
    }
    return await httpRequest({ url, method, data })
  }

  // 修改某个图书分类
  async updateClassifyTitle ({ id, title } = {}) {
    const url = `${this.bookclassifyURL}/update/title`
    const method = 'POST'
    const data = {
      id,
      title
    }
    return await httpRequest({ url, method, data })
  }

  // 删除某个图书分类
  async removeClassify (id) {
    const url = `${this.bookclassifyURL}/${id}`
    const method = 'DELETE'
    return await httpRequest({ url, method })
  }
}

export default new BookClassify()
