const fs = require('fs')
const path = require('path')

let privateKey, publicKey

// TODO 使用异步读取在其它地方会出现问题
// const getSecretKey = (type) => {
//   return new Promise((resolve, reject) => {
//     const filePath = path.join(__dirname, `./rsa_${type}_key.pem`)
//     fs.readFile(filePath, (err, data) => {
//       if (err) reject(new Error(err))
//       resolve(data)
//     })
//   })
// }

const getSecretKey = (type) => {
  const filePath = path.join(__dirname, `./rsa_${type}_key.pem`)
  return fs.readFileSync(filePath)
}

privateKey = getSecretKey('private')
publicKey = getSecretKey('public')


module.exports = {
  privateKey,
  publicKey
}






