import httpRequest from '../../config'

class InviteCode {
  constructor () {
    this.InviteCodeURL = 'http://localhost:9090/invite'
  }

  async inviteCodeList ({ page, size } = {}) {
    const url = `${this.InviteCodeURL}/list`
    const params = {
      page,
      size
    }
    return await httpRequest({ url, params })
  }

  async addInviteCode ({ count } = {}) {
    const url = `${this.InviteCodeURL}/add`
    const params = { count }
    return await httpRequest({ url, params })
  }

  async removeInviteCode ({ id } = {}) {
    const url = `${this.InviteCodeURL}/${id}`
    const method = 'DELETE'
    return await httpRequest({ url, method })
  }
}

export default new InviteCode()
