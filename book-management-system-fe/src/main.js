import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { service } from './service'
import { Tabs, Input, Table } from 'ant-design-vue'
import AntUI from '@/plugins/ant-design-ui'
import SpaceBetween from '@/components/space-between'

// 导入scss入口文件
import '@/assets/scss/index.scss'

const app = createApp(App)
app.use(AntUI).use(Tabs).use(Input).use(Table)
// 注册全局组件
app.component('spaces-between', SpaceBetween)

/** 在app的原型上挂载service模块 */
app.config.globalProperties.$service = service

app.use(store).use(router).mount('#app')
