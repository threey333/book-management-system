import httpRequest from '../../config'
import { domain } from '../../utils'

class Character {
  constructor () {
    this.character = `${domain}/character`
  }

  // 获取权限列表数据
  async getCharacterList () {
    const url = `${this.character}/list`
    return await httpRequest({ url })
  }
}

export default new Character()
