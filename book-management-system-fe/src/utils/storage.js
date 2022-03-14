class Storage {
  constructor (storageType = 'localStorage') {
    this.storageType = storageType
  }

  get (key) {
    let value = window[this.storageType].getItem(key)
    if (!value) return value

    try {
      value = JSON.parse(value)
    } catch (e) {
      console.log('parse storage error', e, key, value)
    }
    return value
  }

  set (key, value) {
    window[this.storageType].setItem(key, JSON.stringify(value))
  }

  remove (key) {
    window[this.storageType].removeItem(key)
  }
}

export const sessionStorage = new Storage('sessionStorage')

export default new Storage()
