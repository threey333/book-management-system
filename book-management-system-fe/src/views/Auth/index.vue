<template>
  <div class="auth-wrapper">
    <div class="auth-wrapper-bg"></div>
    <div class="auth-wrapper-title">
      <img src="../../../public/logo.png" alt="book-managemenet-system" />
      <h2 class="auth-wrapper-title-info">图书管理系统 后台</h2>
    </div>
    <div class="auth-wrapper-form">
      <a-tabs>
        <a-tab-pane key="login" tab="登入">
          <div class="auth-wrapper-form-item">
            <a-input size="large" placeholder="账户">
              <!-- 插槽 -->
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </div>
          <div class="auth-wrapper-form-item">
            <a-input size="large" placeholder="密码">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
          </div>
          <div class="auth-wrapper-form-item">
            <a href>忘记密码</a>
          </div>
          <a-button size="large" class="auth-wrapper-form-btn" type="primary">登入</a-button>
        </a-tab-pane>
        <a-tab-pane key="register" tab="注册">
          <div class="auth-wrapper-form-item">
            <a-input size="large" placeholder="账户">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </div>
          <div class="auth-wrapper-form-item">
            <a-input size="large" placeholder="密码">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
          </div>
          <div class="auth-wrapper-form-item">
            <a-input size="large" placeholder="邀请码">
              <template #prefix>
                <MailOutlined />
              </template>
            </a-input>
          </div>
          <a-button size="large" class="auth-wrapper-form-btn" type="primary">注册</a-button>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    MailOutlined
  },
  setup () {
    return {}
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
