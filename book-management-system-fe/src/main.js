import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { service } from './service'

// 导入scss入口文件
import '@/assets/scss/index.scss'

const app = createApp(App)

/* 在app的原型上挂载service */
app.config.globalProperties.$service = service

app.use(store).use(router).mount('#app')
