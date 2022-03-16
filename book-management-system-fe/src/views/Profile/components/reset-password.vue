<template>
  <a-card title="修改密码" :headStyle="cartHeadTitle">
    <a-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
      <a-form-item label="原始密码">
        <a-input type="password" v-model:value="form.oldPassword" />
      </a-form-item>
      <a-form-item label="新密码">
        <a-input type="password" v-model:value="form.newPassword" />
      </a-form-item>
      <a-form-item label="确认新密码">
        <a-input type="password" v-model:value="form.confirmNewPassword" />

        <div style="margin-top: 24px;">
          <a-button @click="resetPassword" type="primary">修改</a-button>&nbsp;&nbsp;
          <a-button @click="clear" type="primary" ghost>清除</a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { result } from '@/utils'
import { message } from 'ant-design-vue'
import { service } from '@/service'

export default defineComponent({
  name: 'Profile',
  setup () {
    // 设置title样式
    const cartHeadTitle = ref({
      'font-weight': 'bold',
      'font-size': '24px',
      'text-align': 'left'
    })

    const form = reactive({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })

    // 重置密码
    const resetPassword = async () => {
      const {
        confirmNewPassword,
        newPassword,
        oldPassword
      } = form

      if (confirmNewPassword !== newPassword) {
        message.error('两次输入的密码不同')
        return
      }
      const res = await service.profile.resetPassword({
        newPassword,
        oldPassword
      })
      result(res)
        .success((msg) => {
          message.success(msg)

          form.oldPassword = ''
          form.confirmNewPassword = ''
          form.newPassword = ''
        })
    }

    // 清除输入过的内容
    const clear = () => {
      const {
        confirmNewPassword,
        newPassword,
        oldPassword
      } = form

      if (confirmNewPassword || newPassword || oldPassword) {
        form.oldPassword = ''
        form.confirmNewPassword = ''
        form.newPassword = ''
      }
    }

    return {
      cartHeadTitle,
      form,

      resetPassword,
      clear
    }
  }
})

</script>

<style lang="scss" scoped>
</style>
