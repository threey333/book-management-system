import httpRequest from '../../config'

class Log {
  constructor () {
    this.logURL = 'http://localhost:9090/log'
  }

  async getLogList ({ page, size }) {
    const url = `${this.logURL}/list?page=${page}&size=${size}`
    return await httpRequest({ url })
  }

  async removeOneLog (id) {
    const url = `${this.logURL}/delete`
    const method = 'POST'
    const data = {
      id
    }
    return await httpRequest({ url, method, data })
  }
}

export default new Log()
