import httpRequest from '../../config'
import { domain } from '../../utils'
class DashBoard {
  constructor () {
    this.InviteCodeURL = `${domain}/dashBoard`
  }

  async baseInfo () {
    const url = `${this.InviteCodeURL}/base-info`
    return await httpRequest({ url })
  }
}

export default new DashBoard()
