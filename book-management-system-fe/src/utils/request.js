// import { service } from '@/service'
import { getToken } from './token'

// const getURL = (path) => {
//   return `${domain}${path}`
// }

export const getHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`
  }
}
