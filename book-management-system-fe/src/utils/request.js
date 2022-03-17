// import { service } from '@/service'
import { getToken } from './token'

// const domain = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:9090'

// const getURL = (path) => {
//   return `${domain}${path}`
// }

export const getHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`
  }
}
