<template>
  <div class="dash-board-wrapper">
    <a-spin :spinning="loading">
      <a-card>
        <!-- 头部数据总览 -->
        <dash-board-title :baseInfo="baseInfo" />
        <!-- 内容表格总览 -->
        <dash-board-table />
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import DashBoardTitle from './components/dash-board-title.vue'
import DashBoardTable from './components/dash-board-table.vue'

import { service } from '@/service'
import { result } from '@/utils'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'DashBoard',
  components: {
    DashBoardTitle,
    DashBoardTable
  },
  setup () {
    const loading = ref(false)
    const baseInfo = ref({
      total: {
        good: 0,
        user: 0,
        log: 0
      }
    })

    const getBaseInfo = async () => {
      loading.value = true
      const res = await service.dashBoard.baseInfo()
      loading.value = false

      result(res)
        .success((msg, { data: { total } }) => {
          message.success(msg)
          baseInfo.value = total
        })
    }

    onMounted(() => {
      getBaseInfo()
    })

    return {
      loading,
      baseInfo
    }
  }
})

</script>

<style lang="scss" scoped>
</style>
