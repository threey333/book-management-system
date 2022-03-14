/** 所有跟成员相关的帮助方法都写在这里*/

/**
 * -1 无任何权限
 * 0 管理员权限
 * 1 增加权限
 * 2 删除权限
 * 3 查找权限
 * 4 修改权限
 */
const defaultCharacters = [
  {
    name: 'admin',
    title: '管理员',
    power: {
      book: [0],
      user: [0]
    }
  },
  {
    name: 'member',
    title: '成员',
    power: {
      book: [1],
      user: [-1]
    }
  }
]

module.exports = {
  defaultCharacters
}