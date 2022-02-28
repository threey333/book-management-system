const fs = require('fs')
const path = require('path')

let privateKey, publicKey
const getSecretKey = async (type) => {
  try {
    return await new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, `./rsa_${type}_key.pem`)
      fs.readFile(filePath, (err, data) => {
        if (err) reject(new Error(err))
        resolve(data)
      })
    })
  } catch (error) {
    console.log(error.message)
  }
}

// 获取密钥
// getSecretKey('private').then(res => {
//   privateKey = res
//   return getSecretKey('public')
// }).then(res => {
//   // 获取公钥
//   publicKey = res
// }).then(() => {
//   console.log(publicKey)
//   console.log(privateKey)
// })

module.exports = {
  getSecretKey
}






