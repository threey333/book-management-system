<template>
  <div class="nav">
    <h1>Vue3-图书管理系统</h1>
    <hello/>
  </div>
  <router-view />
</template>

<script>
import Hello from '@/components/HelloWorld.vue'

export default {
  components: {
    Hello
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav {
  padding: 30px;
  &-box {
    @include flex-center();
    width: 400px;
    height: 400px;
    background-color: #eee;
  }
}
</style>
