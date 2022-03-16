<template>
  <div class="log-wrapper">
    <a-spin :spinning="loading">
      <a-card class="log-wrapper-card">
        <!-- 标题 -->
        <h3 class="log-wrapper-card-title">操作日志</h3>
        <a-divider />

        <!-- 表格 -->
        <a-table bordered :columns="columns" :data-source="logList" :pagination="false">
          <template #createdAt="{ record }">{{ formatTimestamp(record.meta.createdAt) }}</template>
          <template #operation="{ record }">
            <a href="javascript:;" @click="remove(record)" style="display:inline-block;">删除</a>
          </template>
        </a-table>

        <!-- 分页 -->
        <flex-end style="margin-top:24px;">
          <a-pagination
            v-model:current="curPage"
            :pageSize="pageSize"
            :total="total"
            @change="setCurPage"
          />
        </flex-end>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { service } from '@/service/'
import { result, formatTimestamp } from '@/utils'
import { message } from 'ant-design-vue'
import { getLogInfoByPath } from '@/utils/log'

const columns = [
  {
    title: '用户名',
    dataIndex: 'user.account',
    key: 'user.account'
  },
  {
    title: '动作',
    dataIndex: 'action',
    key: 'action'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    slots: {
      customRender: 'createdAt'
    }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    slots: {
      customRender: 'operation'
    }
  }
]
// const defaultData = [
//   {
//     key: '',
//     account: '',
//     path: '',
//     createdAt: '',
//     actions: ''
//   }
// ]

export default defineComponent({
  name: 'Log',
  setup () {
    const logList = ref([])
    const curPage = ref(1)
    const total = ref(0)
    const pageSize = ref(10)
    const loading = ref(false)

    // 获取日志操作列表数据
    const getLogList = async () => {
      loading.value = true
      const res = await service.log.getLogList({
        page: curPage.value,
        size: pageSize.value
      })
      loading.value = false
      result(res)
        .success((msg, { data: { list: l, total: t } }) => {
          total.value = t
          logList.value = l.map(item => {
            const key = item._id
            const action = getLogInfoByPath(item.request.url)
            return {
              ...item,
              key,
              action
            }
          })
          message.success(msg)
        })
    }

    onMounted(() => {
      getLogList()
    })

    const setCurPage = (page) => {
      curPage.value = page
      getLogList()
    }

    const remove = async ({ _id }) => {
      const res = await service.log.removeOneLog(_id)
      result(res)
        .success((msg) => {
          getLogList()
          message.success(msg)
        })
    }

    return {
      columns,
      logList,
      pageSize,
      curPage,
      total,
      loading,

      getLogList,
      setCurPage,
      getLogInfoByPath,
      formatTimestamp,
      remove
    }
  }
})

</script>

<style lang="scss" scoped>
.log-wrapper {
  &-card {
    &-title {
      font-size: 24px;
      font-weight: 600;
      text-align: left;
    }
  }
}
</style>
