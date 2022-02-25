import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { service } from './service'
import { Tabs } from 'ant-design-vue'
import AntUI from '@/plugins/ant-design-ui'

// 导入scss入口文件
import '@/assets/scss/index.scss'

const app = createApp(App)
app.use(AntUI).use(Tabs)

/** 在app的原型上挂载service模块 */
app.config.globalProperties.$service = service

app.use(store).use(router).mount('#app')
