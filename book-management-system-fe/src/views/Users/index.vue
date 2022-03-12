<template>
  <div class="users-wrapper">
    <a-card>
      <h2>用户管理</h2>
      <a-divider />
      <space-between class="users-wrapper-actions">
        <div class="users-wrapper-actions-search">
          <a-input-search
            placeholder="根据账户搜索"
            v-model:value="keyword"
            enter-button
            @search="onSearch"
          />
          <a v-if="isBack" href="javascript:;" @click="backAll">返回</a>
        </div>
        <a-button
          class="users-wrapper-action-addUser"
          type="primary"
          @click="showAddDialog = true"
        >添加用户</a-button>
      </space-between>
      <a-divider />

      <!-- 表格 -->
      <div class="users-wrapper-table">
        <a-table bordered :pagination="false" :columns="columns" :data-source="list">
          <template #createdAt="{ record }">{{ formatTimestamp(record.meta.createdAt) }}</template>
          <template #actions="{ record }">
            <a href="javascript:;" @click="reset(record)">重置密码</a>
            &nbsp;
            <a href="javascript:;" @click="remove(record)">删除</a>
          </template>
        </a-table>
      </div>

      <!-- 分页 -->
      <flex-end style="margin-top: 24px;" v-if="!isBack">
        <a-pagination
          v-model:current="curPage"
          :page-size="size"
          :total="userTotal"
          @change="setPage"
        ></a-pagination>
      </flex-end>
    </a-card>
    <AddOne v-model:show="showAddDialog" @getList="getUser" />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import FlexEnd from '@/components/flex-end'
import { vueProperties, result, formatTimestamp } from '@/utils'
import { message } from 'ant-design-vue'
import AddOne from './components/add-one.vue'

const columns = [
  {
    title: '账户',
    key: 'account',
    dataIndex: 'account'
  },
  {
    title: '创建日期',
    key: 'createdAt',
    dataIndex: 'createdAt',
    slots: {
      customRender: 'createdAt'
    }
  },
  {
    title: '操作',
    key: 'actions',
    dataIndex: 'actions',
    slots: {
      customRender: 'actions'
    }
  }
]

export default defineComponent({
  name: 'Users',
  components: {
    FlexEnd,
    AddOne
  },
  setup () {
    const { $service } = vueProperties()
    const list = ref([]) // 用户列表
    const curPage = ref(1) // 分页默认是第一页
    const size = ref(4) // 每页默认显示大小为10条
    const userTotal = ref(0)
    const showAddDialog = ref(false)
    const keyword = ref('') // 账户关键字
    const isBack = ref(false) // 搜索过后是否进行返回

    // 获取用户
    const getUser = async () => {
      const res = await $service.user.getUserList({
        page: curPage.value,
        size: size.value,
        keyword: keyword.value
      })
      result(res)
        .success((msg, { data: { list: resList, total: resTotal } }) => {
          list.value = resList.map((item) => {
            const key = item._id
            return { ...item, key }
          })
          userTotal.value = resTotal
          message.success(msg)
        })
    }
    onMounted(() => {
      getUser()
    })

    // 删除用户
    const remove = async ({ _id }) => {
      const res = await $service.user.removeUser({ id: _id })
      result(res)
        .success((msg, { data: { id: delId } }) => {
          const delTargetIndex = list.value.findIndex(item => item._id === delId)
          list.value.splice(delTargetIndex, 1)
          message.success(msg)
        })
    }

    // 翻页
    const setPage = (page) => {
      curPage.value = page
      getUser()
    }

    // 重置密码
    const reset = async ({ _id }) => {
      const res = await $service.user.resetPassword({ id: _id })
      result(res)
        .success((msg) => {
          message.success(msg)
        })
    }

    // 搜索
    const onSearch = () => {
      getUser()
      isBack.value = !!keyword.value
    }

    // 返回
    const backAll = () => {
      isBack.value = false
      keyword.value = ''
      getUser()
    }

    return {
      list,
      curPage,
      size,
      userTotal,
      columns,
      showAddDialog,
      keyword,
      isBack,

      formatTimestamp,
      remove,
      getUser,
      setPage,
      reset,
      onSearch,
      backAll
    }
  }
})

</script>

<style lang="scss" scoped>
.users-wrapper {
  &-actions-search {
    display: inline-flex;
    align-items: center;
    a {
      display: block;
      margin-left: 16px;
      min-width: 40px;
    }
  }
}
</style>
