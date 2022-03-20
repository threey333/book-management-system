import httpRequest from '../../config'
import { domain } from '../../utils'

class Profile {
  constructor () {
    this.profileURL = `${domain}/profile`
  }

  //
  async resetPassword ({ newPassword, oldPassword }) {
    const url = `${this.profileURL}/update/password`
    const method = 'POST'
    const data = {
      password: newPassword,
      oldPassword
    }
    return await httpRequest({ url, method, data })
  }
}

export default new Profile()
