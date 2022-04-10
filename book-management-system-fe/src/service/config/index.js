/* axios二次封装 */
import axios from 'axios'
// import router from '@/router'
import qs from 'qs'
import { getToken } from '@/utils/token'

// 设置统一URL地址前缀 --- 看情况设置
// const baseURL = 'https://netease-cloud-music-api-coral-eight.vercel.app/'

// 设置为 'application/x-www-form-urlencoded' 是为了解决后端接收不到前端发送的数据
const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

// `transformRequest` 允许在向服务器发送q请求前，修改请求数据
const transformRequest = function (data, headers) {
  const ContentType = headers['Content-Type'] || headers.common['Content-Type'] || headers.post['Content-Type'] || 'application/json'
  if (ContentType === 'application/json') {
    return JSON.stringify(data)
  }
  if (ContentType === 'application/x-www-form-urlencoded') {
    // qs插件是处理url中参数的一个js库
    return qs.stringify(data)
  }
  return data
}

// 设置请求超时的时间
const timeout = 10 * 1000

// withCredentials 表示跨域请求时是否需要使用凭证。
const withCredentials = false // 默认不使用凭证

// validateStatus 定义对于给定的 HTTP 响应状态码是 resolve还是 reject.
const validateStatus = function (status) {
  // 自定义响应成功的HTTP状态码
  return /^(2|3)\d{2}$/.test(status)
}

export default function $axios (config = {}) {
  const instance = axios.create({
    timeout,
    headers,
    transformRequest,
    withCredentials,
    validateStatus
  })

  // 设置请求次数，请求的间隙
  instance.defaults.retry = 4 // 重新发送请求次数
  instance.defaults.retryDelay = 1000 // 每次重新发送请求的间隔时间

  /* 请求拦截器 */
  instance.interceptors.request.use(config => {
    const token = getToken()
    // 如果token存在
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config
  })

  /* 响应拦截器 */
  instance.interceptors.response.use(response => {
    // 只返回响应主体中的信息（部分公司根据需求会进一步完善，例如指定服务器返回的CODE值来指定成功还是失败）
    return response.data
  }, error => {
    // 从服务器没有获取到数据（即网络层失败）
    // let response = null
    const { response } = error
    if (response) {
      // 服务器会有响应，只不过状态码是4/5开头的,所以判断进行处理
      const { status } = response
      switch (status) {
        case 401:
          error.message = '未授权，请登录'
          // router.push('/auth')
          // 一般情况下都是未登录，此时在这里写路由跳转到登录页。
          break
        case 403:
          // 一般情况下是TOKEN已经过期
          error.message = 'TOKEN过期'
          localStorage.removeItem('token')
          // TODO 调整到登录页
          break
        case 404:
          console.dir(error)
          error.message = `请求地址不存在: ${error.response.config.url}`
          // 一般情况下都是地址不存在。sdasdas
          break
        case 500:
          error.message = '服务器内部错误'
          break
      }
      return Promise.reject(error)
    } else {
      /**
       * 连接超时或者断开网络了，此时进行判断。
       * 注意，超时response是为undefined。
      */
      // 情况一: 断开了网络
      if (!window.navigator.onLine) {
        // 断开网络了，可以让其跳转到断网页面
        // router.push('/auth')
        return
      }
      // 情况二: 连接超时
      if (error && error.code === 'ECONNABORTED') {
        // 处理超时的情况
        const { config } = error
        // 如果配置不存在或未设置重试选项，则拒绝
        if (!config || !config.retry) return Promise.reject(error)

        // 设置用于跟踪重试次数的变量
        config.__retryCount = config.__retryCount || 0

        // 检查我们是否已达到重试总数
        if (config.__retryCount >= config.retry) {
          error.message = '请求超时'
          // 拒绝错误
          return Promise.reject(error)
        }

        // 增加重试次数
        config.__retryCount += 1

        // 创建新的promise来处理指数退避
        const backoff = new Promise(function (resolve) {
          setTimeout(function () {
            resolve()
          }, config.retryDelay || 1)
        })

        // 返回调用 axios 重试请求的承诺
        return backoff.then(function () {
          return instance(config)
        })
      }
      return Promise.reject(error)
    }
  })
  // 然后改实例出去
  return instance(config)
}
