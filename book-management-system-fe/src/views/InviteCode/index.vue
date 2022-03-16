<template>
  <div class="invite-code-wrapper">
    <a-card title="邀请码管理">
      <div class="invite-code-wrapper-top">
        <a-input-number v-model:value="count" :min="1" :max="10000" type />&nbsp;
        <a-button type="primary" @click="add">添加</a-button>
      </div>
      <a-divider />
      <!-- 表格 -->
      <a-table bordered :pagination="false" :columns="columns" :data-source="inviteCodeList">
        <template #status="{ record }">{{ record.user ? '已使用' : '未使用' }}</template>
        <template #actions="{ record }">
          <a-button @click="remove(record)" size="small" type="primary" danger>删除</a-button>
        </template>
      </a-table>

      <!-- 分页 -->
      <flex-end style="margin-top: 24px">
        <a-pagination
          v-model:current="curPage"
          :pageSize="pageSize"
          :total="total"
          @change="setPage"
        ></a-pagination>
      </flex-end>>
    </a-card>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { service } from '@/service'
import { result } from '@/utils'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '邀请码',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '使用状态',
    dataIndex: 'status',
    key: 'status',
    slots: {
      customRender: 'status'
    }
  },
  {
    title: '操作',
    dataIndex: 'actions',
    key: 'actions',
    slots: {
      customRender: 'actions'
    }
  }
]

export default defineComponent({
  name: 'InviteCode',
  setup () {
    const count = ref(1)
    const curPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const inviteCodeList = ref([])

    const getInviteCodeList = async () => {
      const res = await service.inviteCode.inviteCodeList({
        page: curPage.value,
        size: pageSize.value
      })
      result(res)
        .success((msg, { data: { list: l, total: t } }) => {
          total.value = t
          inviteCodeList.value = l.map(item => {
            const key = item._id
            return {
              ...item,
              key
            }
          })
          message.success(msg)
        })
    }

    const add = async () => {
      const res = await service.inviteCode.addInviteCode({
        count: count.value
      })
      result(res)
        .success((msg) => {
          getInviteCodeList()
          message.success(`成功添加 ${count.value} 条邀请码`)
        })
    }

    const remove = async ({ _id }) => {
      const res = await service.inviteCode.removeInviteCode({
        id: _id
      })
      result(res)
        .success((msg) => {
          getInviteCodeList()
          message.success(msg)
        })
    }

    const setPage = (page) => {
      curPage.value = page
      getInviteCodeList()
    }

    onMounted(() => {
      getInviteCodeList()
    })

    return {
      columns,
      inviteCodeList,
      count,
      curPage,
      pageSize,
      total,

      add,
      remove,
      setPage
    }
  }
})

</script>

<style lang="scss" scoped>
.invite-code-wrapper {
}
</style>
