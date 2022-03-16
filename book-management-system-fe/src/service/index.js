/**
 * 二次封装下的各请求接口模块
*/
import auth from './requestData/Auth'
import book from './requestData/Book'
import inventoryLog from './requestData/InventoryLog'
import user from './requestData/User'
import character from './requestData/Character'
import log from './requestData/Log'
import resetPassword from './requestData/ResetPassword'

export const service = {
  auth,
  book,
  inventoryLog,
  user,
  character,
  log,
  resetPassword
}
