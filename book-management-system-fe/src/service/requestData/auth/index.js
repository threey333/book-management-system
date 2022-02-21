import httpRequest from '../../config'
import { handleLearningRequest } from '../../utils'

class Auth {
  constructor () {
    this.songURL = 'https://netease-cloud-music-api-coral-eight.vercel.app'
  }

  // 注册
  async register ({ account, password, inviteCode } = {}) {
    const url = '/auth/register'
    const method = 'POST'
    const data = {
      account,
      password,
      inviteCode
    }
    return handleLearningRequest(await httpRequest({ url, data, method }))
  }

  // 登录
  async login ({ account, password } = {}) {
    const url = '/auth/login'
    const method = 'POST'
    const data = {
      account,
      password
    }
    return handleLearningRequest(await httpRequest({ url, data, method }))
  }

  async getSongURL ({ songID } = {}) {
    const url = `${this.songURL}/song/url`
    const params = {
      id: typeof songID === 'number' ? songID : songID.join(',')
    }
    return handleLearningRequest(await httpRequest({ url, params }))
  }
}

export default new Auth()
