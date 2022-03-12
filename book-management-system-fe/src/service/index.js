/**
 * 二次封装下的各请求接口模块
*/
import auth from './requestData/Auth'
import book from './requestData/Book'
import inventoryLog from './requestData/InventoryLog'
import user from './requestData/User'

export const service = {
  auth,
  book,
  inventoryLog,
  user
}
