import { getCurrentInstance } from 'vue'

export const vueProperties = () => {
  const { appContext } = getCurrentInstance()
  return appContext.config.globalProperties
}
