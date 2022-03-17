import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { service } from './service'
import {
  Tabs,
  Input,
  Table,
  Form,
  DatePicker,
  InputNumber,
  Pagination,
  Select,
  Menu,
  Spin,
  Upload
} from 'ant-design-vue'
import AntUI from '@/plugins/ant-design-ui'

import SpaceBetween from '@/components/space-between'
import ElDialog from '@/components/dialog/index.vue'
import FlexEnd from '@/components/flex-end'

// 导入scss入口文件
import '@/assets/scss/index.scss'

const app = createApp(App)

// 注册ant-design组件
app.use(AntUI)
  .use(Tabs)
  .use(Input)
  .use(Table)
  .use(Form)
  .use(DatePicker)
  .use(InputNumber)
  .use(Pagination)
  .use(Select)
  .use(Menu)
  .use(Spin)
  .use(Upload)
// 注册全局组件
app.component('space-between', SpaceBetween)
app.component('el-dialog', ElDialog)
app.component('flex-end', FlexEnd)

/** 在app的原型上挂载service模块 */
app.config.globalProperties.$service = service

app.use(store).use(router).mount('#app')
