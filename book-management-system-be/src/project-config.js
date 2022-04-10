const { privateKey, publicKey } = require('./secret-key')
const { resolve } = require('path')

module.exports = {
  DEFAULT_PASSWORD: '1234567890',
  JWT_PRIVATE_KEY: privateKey,
  JWT_PUBLIC_KEY: publicKey,
  UPLOAD_DIR: resolve(__dirname, '../upload'),
  SERVER_PORT: 3000
}