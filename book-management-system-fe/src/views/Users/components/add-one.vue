<template>
  <div class="add-one">
    <el-dialog :visible="show" @confirm-submission="submit" @close-dialog="close" title="添加一个用户">
      <!-- 使用默认插槽 -->
      <template v-slot:default>
        <a-form :model="formData" :label-col="{ span: 4 }">
          <a-form-item label="账户">
            <a-input v-model:value="formData.account" />
          </a-form-item>
          <a-form-item label="密码">
            <a-input v-model:value="formData.password" />
          </a-form-item>
        </a-form>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { vueProperties, result, clone } from '@/utils'
import { message } from 'ant-design-vue'

const defaultFormData = {
  account: '',
  password: ''
}

export default defineComponent({
  name: 'AddOne',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup (props, context) {
    const { $service } = vueProperties()

    const formData = reactive(clone(defaultFormData))

    // 关闭对话框
    const close = () => {
      context.emit('update:show', false)
    }

    // 确认提交
    const submit = async () => {
      const cloneFormData = clone(formData)

      const res = await $service.user.addUser(cloneFormData)
      result(res)
        .success((msg, { data: userData }) => {
          Object.assign(formData, defaultFormData)
          message.success(msg)
          close()
          context.emit('getList')
        })
    }

    return {
      formData,
      submit,
      close
    }
  }
})

</script>

<style lang="scss" scoped>
</style>
