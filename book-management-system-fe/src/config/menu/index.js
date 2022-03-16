/**
 * onlyAdmin字段为true，说明只有角色是管理员身份才能看得到
*/
export default [
  {
    title: '书籍管理',
    url: '/books',
    onlyAdmin: false
  },
  {
    title: '用户管理',
    url: '/user',
    onlyAdmin: true
  },
  {
    title: '日志操作',
    url: '/log',
    onlyAdmin: true
  },
  {
    title: '杂项',
    onlyAdmin: false,
    children: [
      {
        title: '重置密码列表',
        url: '/reset/password',
        onlyAdmin: true
      }
    ]
  }
]
