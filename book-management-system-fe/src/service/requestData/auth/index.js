import httpRequest from '../../config'
// import { handleLearningRequest } from '../../utils'
class Auth {
  constructor () {
    this.songURL = 'https://netease-cloud-music-api-coral-eight.vercel.app'
    this.authURL = 'http://localhost:9090'
  }

  // 注册
  async register ({ account, password, inviteCode } = {}) {
    const url = `${this.authURL}/auth/register`
    const method = 'POST'
    const data = {
      account,
      password,
      inviteCode
    }
    const withCredentials = true
    return await httpRequest({ url, data, method, withCredentials })
  }

  // 登录
  async login ({ account, password } = {}) {
    const url = `${this.authURL}/auth/login`
    const method = 'POST'
    const data = {
      account,
      password
    }
    const withCredentials = true
    return await httpRequest({ url, data, method, withCredentials })
  }
}

export default new Auth()
