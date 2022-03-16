<template>
  <div class="reset-password-wrapper">
    <a-card class="reset-password-wrapper-title" title="重置密码申请表" :headStyle="cartHeadTitle">
      <!-- 表格 -->
      <a-table bordered :pagination="false" :columns="columns" :data-source="resetPasswrodList">
        <template #action="{ record }">
          <a-button size="small" type="primary" @click="chageStatus(record, 2)">重置</a-button>&nbsp;
          <a-button size="small" @click="chageStatus(record, 3)">忽略</a-button>
        </template>
      </a-table>
      <!-- 分页 -->
      <flex-end style="margin-top: 24px;">
        <a-pagination
          v-model:current="curPage"
          :pageSize="pageSize"
          :total="total"
          @change="setCurPage"
        ></a-pagination>
      </flex-end>
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
    title: '账户',
    key: 'account',
    dataIndex: 'account'
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    slots: {
      customRender: 'action'
    }
  }
]

export default defineComponent({
  name: 'ResetPassword',
  setup () {
    // 设置title样式
    const cartHeadTitle = ref({
      'font-weight': 'bold',
      'font-size': '24px',
      'text-align': 'left'
    })

    const curPage = ref(1)
    const pageSize = ref(4)
    const total = ref(0)
    const resetPasswrodList = ref([])

    // 获取需要重置密码的数据
    const getList = async () => {
      const res = await service.resetPassword.getResetPWDList({
        page: curPage.value,
        size: pageSize.value
      })
      result(res)
        .success((msg, { data: { total: t, list: l } }) => {
          total.value = t
          resetPasswrodList.value = l.map(item => {
            const key = item._id
            return {
              ...item,
              key
            }
          })
          message.success(msg)
        })
    }

    // 改变重置密码的状态 2是已处理，3是已忽略
    const chageStatus = async ({ _id }, status) => {
      console.log(_id, status)
      const res = await service.resetPassword.updateStatus({
        id: _id,
        status
      })
      result(res)
        .success((msg) => {
          message.success(msg)

          getList()
        })
    }

    onMounted(() => {
      getList()
    })

    const setCurPage = (page) => {
      curPage.value = page
      getList()
    }

    return {
      columns,
      cartHeadTitle,
      resetPasswrodList,
      curPage,
      pageSize,
      total,

      chageStatus,
      setCurPage
    }
  }
})

</script>

<style lang="scss" scoped>
</style>
