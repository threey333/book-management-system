import httpRequest from '../../config'
import { domain } from '../../utils'
class ResetPassword {
  constructor () {
    this.resetPasswordURL = `${domain}/reset-password`
  }

  async getResetPWDList ({ page, size }) {
    const url = `${this.resetPasswordURL}/list`
    const params = {
      page,
      size
    }
    return await httpRequest({ url, params })
  }

  async addforgetPassword ({ account }) {
    const url = `${this.resetPasswordURL}/add`
    const data = {
      account
    }
    const method = 'POST'
    return await httpRequest({ url, data, method })
  }

  async updateStatus ({ id, status }) {
    const url = `${this.resetPasswordURL}/update/status`
    const data = {
      id,
      status
    }
    const method = 'POST'
    return await httpRequest({ url, data, method })
  }
}

export default new ResetPassword()
