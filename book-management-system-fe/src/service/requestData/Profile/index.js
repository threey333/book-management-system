import httpRequest from '../../config'

class Profile {
  constructor () {
    this.profileURL = 'http://localhost:9090/profile'
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
