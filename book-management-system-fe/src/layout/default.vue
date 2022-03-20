<template>
  <div class="default-layout">
    <div class="default-layout-header">
      <div class="default-layout-header-left">
        <img src="../../public/logo.png" alt="book-managemenet-system" />
        <span>图书管理系统</span>
      </div>
      <div class="default-layout-header-right">
        <span class="default-layout-header-right-message">你好，{{ store.userInfo.account }}</span>
        <button class="el-btn el-btn-primary btn" @click="logout">退出</button>
      </div>
    </div>
    <div class="default-layout-placeholder"></div>
    <article class="default-layout-content">
      <section class="default-layout-content-left">
        <LayoutLeftNav />
      </section>
      <section class="default-layout-content-right">
        <router-view />
      </section>
    </article>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import LayoutLeftNav from '@/components/layout-left-nav'
import { setToken } from '@/utils/token.js'
import store from '@/store'

export default defineComponent({
  components: {
    LayoutLeftNav
  },
  setup () {
    const logout = () => {
      setToken('')

      window.location.href = '/'
    }
    return {
      logout,

      store: store.state
    }
  }
})

</script>

<style lang="scss" scoped>
.default-layout {
  &-placeholder {
    width: 100%;
    height: 64px;
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 64px;
    padding: 0 16px;
    background-color: #fff;
    box-shadow: 0 2px 8px #f0f1f2;
    z-index: 1;
    &-left {
      height: 100%;
      img {
        height: 100%;
        margin-right: 16px;
      }
      span {
        font-size: $font-size-px-18;
        color: rgba(0, 0, 0, 0.87);
        vertical-align: middle;
      }
    }
    &-right {
      display: flex;
      align-items: center;
      height: 100%;
      &-message {
        font-size: 16px;
      }
      .btn {
        margin-left: 16px;
        padding: 4px 15px;
        width: 74px;
        height: 60%;
      }
    }
  }
  &-content {
    display: flex;
    &-left {
      width: 256px;
      background-color: #efefef;
      position: fixed;
      top: 64px;
      bottom: 0;
    }
    &-right {
      flex: 1;
      margin-left: 256px;
      padding: 24px;
    }
  }
}
</style>
