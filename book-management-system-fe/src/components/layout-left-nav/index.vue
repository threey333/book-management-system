<template>
  <div class="left-nav-wrapper">
    <a-menu
      id="dddddd"
      style="width: 100%"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      v-for="item in menu"
      :key="item.url"
    >
      <a-sub-menu :key="item.title" v-if="item.children">
        <template #title>
          <span>{{ item.title }}</span>
        </template>
        <a-menu-item
          v-for="child in item.children"
          :key="child.url"
          @click="to(child.url)"
        >{{ child.title }}</a-menu-item>
      </a-sub-menu>

      <a-menu-item v-else :key="item.url" @click="to(item.url)">{{ item.title }}</a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import menu from '@/config/menu'

export default defineComponent({
  name: 'LayoutLeftNav',
  setup () {
    const openKeys = ref([]) // 收集subMenu菜单项 key 数组
    const selectedKeys = ref([]) // 当前选中的菜单项 key 数组
    const router = useRouter() // 获取路由跳转的相关信息
    const route = useRoute() // 获取路由的相关信息

    onMounted(() => {
      selectedKeys.value = [route.path]
    })

    // 跳转地址
    const to = (targetURL) => {
      router.push(targetURL)
    }

    return {
      openKeys,
      selectedKeys,
      menu,

      to
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
