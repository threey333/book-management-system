/**
 * 说明: 由于ant design部分组件下还还还有其它组件，
 * 对于这些组件我们是不能使用app.component()进行注册的，而是使用app.use()形式。
*/

import { Button, Card, Divider } from 'ant-design-vue'

const components = [Button, Card, Divider]
const AntUI = {
  install: (app, options) => {
    components.forEach(component => {
      app.component(component.name, component)
    })
  }
}

export default AntUI
