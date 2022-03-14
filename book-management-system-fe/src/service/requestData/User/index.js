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

  /**
   *
   * @param {String} account 账户
   * @param {String} password 密码
   * @param {String} character 角色id
   * @returns
   */
  async addUser ({ account, password, character }) {
    const url = `${this.userURL}/add`
    const data = {
      account,
      password,
      character
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

  // 修改角色
  async editCharacter ({ character, userId }) {
    const url = `${this.userURL}/update/character`
    const data = {
      character,
      userId
    }
    const method = 'POST'
    return await httpRequest({ url, data, method })
  }

  // 刷新获取用户信息
  async getUserInfo () {
    const url = `${this.userURL}/info`
    return await httpRequest({ url })
  }
}

export default new User()