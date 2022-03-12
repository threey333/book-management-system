import httpRequest from '../../config'

class User {
  constructor () {
    this.userURL = 'http://localhost:9090/user'
  }

  async getUserList ({ page, size, keyword = '' }) {
    const url = `${this.userURL}/list`
    const params = {
      page,
      size,
      keyword
    }
    return await httpRequest({ url, params })
  }

  async removeUser ({ id }) {
    const url = `${this.userURL}/${id}`
    const method = 'DELETE'
    return await httpRequest({ url, method })
  }

  async addUser ({ account, password }) {
    const url = `${this.userURL}/add`
    const data = {
      account,
      password
    }
    const method = 'POST'
    return await httpRequest({ url, method, data })
  }

  async resetPassword ({ id }) {
    const url = `${this.userURL}/reset/password`
    const method = 'POST'
    const data = {
      id
    }
    return await httpRequest({ url, method, data })
  }
}

export default new User()
