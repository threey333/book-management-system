import httpRequest from '../../config'

class DashBoard {
  constructor () {
    this.InviteCodeURL = 'http://localhost:9090/dashBoard'
  }

  async baseInfo () {
    const url = `${this.InviteCodeURL}/base-info`
    return await httpRequest({ url })
  }
}

export default new DashBoard()
