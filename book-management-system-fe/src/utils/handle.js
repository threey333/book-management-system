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
