import httpRequest from '../../config'
// import { handleLearningRequest } from '../../utils'
class Auth {
  constructor () {
    this.authURL = 'http://localhost:9090/auth'
    this.withCredentials = true
  }

  // 注册
  async register ({ account, password, inviteCode } = {}) {
    const url = `${this.authURL}/register`
    const method = 'POST'
    const data = {
      account,
      password,
      inviteCode
    }
    const withCredentials = this.withCredentials
    return await httpRequest({ url, data, method, withCredentials })
  }

  // 登录
  async login ({ account, password } = {}) {
    const url = `${this.authURL}/login`
    const method = 'POST'
    const data = {
      account,
      password
    }
    const withCredentials = this.withCredentials
    return await httpRequest({ url, data, method, withCredentials })
  }
}

export default new Auth()
