const { privateKey, publicKey } = require('./secret-key')

module.exports = {
  DEFAULT_PASSWORD: '1234567890',
  JWT_PRIVATE_KEY: privateKey,
  JWT_PUBLIC_KEY: publicKey,
}