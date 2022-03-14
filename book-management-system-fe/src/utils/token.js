import storage from './storage'

const getStorageKey = (key) => `book_management_system_${key}`

const TOKEN_STORAGE_KEY = getStorageKey('token')

export const getToken = () => {
  return storage.get(TOKEN_STORAGE_KEY) || ''
}

export const setToken = (token) => {
  storage.set(TOKEN_STORAGE_KEY, token)

  return token
}
