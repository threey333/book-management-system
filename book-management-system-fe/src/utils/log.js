const LOG_MAP = new Map([
  ['/character/list', '获取角色列表'],
  ['/log/list', '获取日志列表'],
  ['/user/info', '获取自己的登入信息']
])

export const getLogInfoByPath = (path) => {
  let title = ''
  for (const [key, value] of LOG_MAP.entries()) {
    if (path.includes(key)) {
      title = path.replace(key, value)
    }
  }
  return title || path
}
