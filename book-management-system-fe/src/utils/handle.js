import { message } from 'ant-design-vue'

/**
 * @param {object} resultData 响应回来的数据
 */
export const result = (resultData, authShowErrorMsg = true) => {
  const { code, msg } = resultData
  if (code === 0 && authShowErrorMsg) {
    message.error(msg)
  }
  return {
    /**
     * @param {Function} cb 回调函数
     * @returns
     */
    success (cb) {
      if (code !== 0) {
        cb && cb(msg, resultData)
      }
      return this
    },
    /**
     *
     * @param {Function} cb 回调函数
     * @returns
     */
    fail (cb) {
      if (code === 0) {
        cb && cb(msg, resultData)
      }
      return this
    },
    /**
     *
     * @param {Function} cb
     */
    finally (cb) {
      cb(msg, resultData)
      return this
    }
  }
}

export const clone = (target) => {
  return JSON.parse(JSON.stringify(target))
}

export const formatTimestamp = (ts) => {
  if (!ts) return ''
  const date = new Date(Number(ts))

  const YYYY = date.getFullYear()
  const MM = date.getMonth() + 1
  const DD = date.getDate()

  const hh = date.getHours()
  const mm = date.getMinutes()
  const ss = date.getSeconds()

  return `${YYYY}/${MM}/${DD}  ${hh}:${mm}:${ss}`
}
