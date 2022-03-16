<template>
  <div class="auth-wrapper">
    <div class="auth-wrapper-bg"></div>
    <div class="auth-wrapper-title">
      <img src="../../../public/logo.png" alt="book-managemenet-system" />
      <h2 class="auth-wrapper-title-info">图书管理系统 后台</h2>
    </div>
    <div class="auth-wrapper-form">
      <a-tabs>
        <!-- 登录 -->
        <a-tab-pane key="login" tab="登入">
          <div class="auth-wrapper-form-item">
            <a-input size="large" placeholder="账户 (admin)" v-model:value="loginForm.account">
              <!-- 插槽 -->
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </div>
          <div class="auth-wrapper-form-item">
            <a-input size="large" placeholder="密码 (admin)" v-model:value="loginForm.password">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
          </div>
          <div class="auth-wrapper-form-item">
            <a href="javascript:;" @click="forgetPassword">忘记密码</a>
          </div>
          <a-button size="large" class="auth-wrapper-form-btn" type="primary" @click="login">登入</a-button>
        </a-tab-pane>
        <!-- 注册 -->
        <a-tab-pane key="register" tab="注册">
          <div class="auth-wrapper-form-item">
            <a-input v-model:value="registerForm.account" size="large" placeholder="账户">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </div>
          <div class="auth-wrapper-form-item">
            <a-input v-model:value="registerForm.password" size="large" placeholder="密码">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
          </div>
          <div class="auth-wrapper-form-item">
            <a-input size="large" placeholder="邀请码" v-model:value="registerForm.inviteCode">
              <template #prefix>
                <MailOutlined />
              </template>
            </a-input>
          </div>
          <a-button class="auth-wrapper-form-btn" type="primary" size="large" @click="register">注册</a-button>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import { vueProperties, result, getCharacterInfoById } from '@/utils'
import { message, Input } from 'ant-design-vue'
import store from '@/store'
import { useRouter } from 'vue-router'
import { setToken } from '@/utils/token'
import ElDialog from '@/components/dialog/index.vue'

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    MailOutlined
  },
  setup () {
    const { $service } = vueProperties()
    // 注册数据
    const registerForm = reactive({
      account: '',
      password: '',
      inviteCode: ''
    })
    const router = useRouter()

    // 注册数据逻辑
    const register = async () => {
      const { account, password, inviteCode } = registerForm
      if (account === '') {
        message.info('请输入账户')
        return
      } else if (password === '') {
        message.info('请输入密码')
        return
      } else if (inviteCode === '') {
        message.info('请输入邀请码')
      } else if (!(/[0-9A-Za-z]{5,13}/.test(account))) {
        message.info('请输入正确的账户和密码')
        return
      }
      const res = await $service.auth.register(registerForm)
      console.log(res)
      result(res).success((msg) => {
        registerForm.account = ''
        registerForm.password = ''
        registerForm.inviteCode = ''
        message.success(msg)
      })
    }

    // 登录数据
    const loginForm = reactive({
      account: '',
      password: ''
    })
    // 登录数据逻辑
    const login = async () => {
      const { account, password } = loginForm
      if (account === '') {
        message.info('请输入账户')
        return
      }
      if (password === '') {
        message.info('请输入密码')
        return
      }
      const res = await $service.auth.login(loginForm)
      result(res)
        .success(async (msg, { data: { user, token } }) => {
          loginForm.account = ''
          loginForm.password = ''

          await store.dispatch('getCharacterInfo')
          store.commit('setUserInfo', user)
          store.commit('setUserCharacter', getCharacterInfoById(user.character))
          setToken(token)

          router.replace('/books')
          message.success(msg)
        })
    }

    // 忘记密码
    const forgetPassword = () => {
      ElDialog.confirm({
        title: '输入账户发起申请，管理员会审核',
        content: (
          <div>
            <Input class="_forget-password_account" />
          </div>
        ),
        onOk: async () => {
          const el = document.querySelector('._forget-password_account')
          const account = el && el.value
          const res = await $service.resetPassword.addforgetPassword({ account })
          result(res)
            .success((msg) => {
              message.success(msg)
            })
        }
      })
    }

    return {
      registerForm,
      register,
      loginForm,
      login,
      forgetPassword
    }
  }
})
</script>

<style lang="scss" scoped>
.auth-wrapper {
  overflow: hidden;
  &-bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent url("../../../public/bg.svg") no-repeat center
      center;
    background-size: cover;
  }
  &-title {
    @include flex-center();
    margin-top: 100px;
    margin-bottom: 32px;
    img {
      width: 60px;
      height: 60px;
    }
    &-info {
      margin: 0;
      margin-left: 18px;
      font-weight: 600;
    }
  }

  &-form {
    width: 400px;
    margin: 0 auto;
    &-item {
      margin-bottom: 16px;
    }
    &-btn {
      width: 100%;
    }
  }
}
</style>
