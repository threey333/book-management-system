const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

// var token = jwt.sign('aaaaa', 'shhhhh')

// console.log(token)

// // 再次加密
// const token2 = jwt.sign('token', 'shhhh', (err, res) => {
//   console.log(res, err)
// })
// console.log(token2, '1')

// 同步方法
// const token1 = jwt.sign({ account: 12346789, password: 134567898 }, 'shhhhh')
// console.log(token1) // => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoxMjM0Njc4OSwicGFzc3dvcmQiOjEzNDU2Nzg5OCwiaWF0IjoxNjQ1OTU1ODkxfQ.5URwzm8OnBxGbkMI3riz2U2GySDWbyHw6Vz39g0_34A

// 异步方法
// const token2 = jwt.sign({ account: 12346789, password: 134567898 }, 'shhhh', (err, tok) => {
//   if (err) throw new Error(err)
//   console.log(2, tok) // => 2 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoxMjM0Njc4OSwicGFzc3dvcmQiOjEzNDU2Nzg5OCwiaWF0IjoxNjQ1OTU1ODkxfQ.CSCWLu_9QEZt_ZTjeZPHHi2vdALdGyhPivt8moF5sFs
// })
// console.log(1, token2) // => 1 undefined

// const token = jwt.sign({ account: 12346789, password: 134567898 }, 'secret')
// console.log(token) // => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoxMjM0Njc4OSwicGFzc3dvcmQiOjEzNDU2Nzg5OCwiaWF0IjoxNjQ1OTY0OTI2fQ.1GjvxBB8sIFZFQKchxy6OSYyTdyRSwDVjjxdrt9nfXc

// 设置有过期时间的令牌
// const token = jwt.sign({
//   exp: Math.floor(Date.now() / 1000) + (60 * 60),
//   data: 'foo bar',
//   _id: 1,
//   name: 'Eson'
// }, 'secret')

// const token1 = jwt.sign({ account: 12346789, password: 134567898 }, 'secret', { expiresIn: 60 * 60 })
// console.log(token)
// console.log(token1)

// // 验证是否过期
// const res = jwt.verify(token, 'secret')
// console.log(res) // => 报错，jwt expired，即token过期

// 设置签名加密的开始时间
// const token = jwt.sign({
//   id: 3,
//   name: 'yyy',
//   iat: Math.floor(Date.now() / 1000) - 30
// }, 'shhhhh')

// 非对称加密使用步骤:

// const readData = () => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path.join(__dirname, './secretKey', 'rsa_private_key.pem'), (err, data) => {
//       if (err) reject(new Error(err))
//       resolve(data)
//     })
//   })
// }
// readData().then(res => {
//   const secretKey = res
//   const token = jwt.sign({ account: 12346789, password: 134567898, id: 3 }, secretKey, {
//     algorithm: 'RS256'
//   })
//   console.log(token) // =>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoxMjM0Njc4OSwicGFzc3dvcmQiOjEzNDU2Nzg5OCwiaWQiOjMsImlhdCI6MTY0NTk2ODYzM30.smDIT8zf8Hxu8wWnThQAJU_QrKag04CGGq5yRkwYkJs
//   return token
// }).then(token => {
//   const publicKey = fs.readFileSync(path.join(__dirname, './secretKey', 'rsa_public_key.pem'))
//   console.log(publicKey)
//   const result = jwt.verify(token, publicKey, { complete: true })
//   console.log(result) // => 验证解密出来的结果: { account: 12346789, password: 134567898, id: 3, iat: 1645969229 }
// })


// 
const token = jwt.sign({ _id: 3, name: 'yyy', exp: Math.floor(Date.now() / 1000) + (3 * 1) }, 'secret')
// token未过期的时候可以进行验证解密
// const result1 = jwt.verify(token, 'secret')
// console.log(result1) // => { _id: 3, name: 'yyy', exp: 1645974455, iat: 1645974452 }
// // 3秒后token过期，verify对过期的token不能正常解密，以至于抛出错误
// setTimeout(() => {
//   const result2 = jwt.verify(token, 'secret') // TokenExpiredError: jwt expired
// }, 3000)

// 异步验证解密token令牌。
// jwt.verify(token, 'secret', (err, data) => {
//   console.log(data) // => { _id: 3, name: 'yyy', exp: 1645974706, iat: 1645974703 }
// })

// 捕获验证解密失败的错误
// try {
//   const result = jwt.verify(token, 'shhh')
//   console.log(result)
// } catch (err) {
//   console.log(new Error(err).message) // => JsonWebTokenError:无效的签名
// }

// `options` 下的 `algorithms` 字段值是一个字符串列表情况。
// jwt.verify(token, 'secret', { algorithms: ['HS256', 'RS256'] }, (err, data) => {
//   if (err) throw new Error(err)
//   console.log(data) // => { _id: 3, name: 'yyy', exp: 1645975421, iat: 1645975418 }
// })

// 三、解码
console.log(jwt.decode(token, { complete: true })) // => { _id: 3, name: 'yyy', exp: 1645975505, iat: 1645975502 }