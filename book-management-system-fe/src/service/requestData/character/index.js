import httpRequest from '../../config'

class Character {
  constructor () {
    this.character = 'http://localhost:9090/character'
  }

  // 获取权限列表数据
  async getCharacterList () {
    const url = `${this.character}/list`
    return await httpRequest({ url })
  }
}

export default new Character()
