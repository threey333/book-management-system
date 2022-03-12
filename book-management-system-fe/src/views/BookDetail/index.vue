<template>
  <div class="book-detail-wrapper">
    <!-- 书籍详情信息 -->
    <a-card class="book-detail">
      <space-between>
        <h3 class="book-detail-title">{{ bookName }}</h3>
        <div class="book-detail-operation">
          <a-button
            class="book-detail-operation-btn"
            type="primary"
            @click="showUpdateDialog = true"
          >编辑</a-button>
          <a-button class="book-detail-operation-btn" type="primary" danger @click="remove">删除</a-button>
        </div>
      </space-between>
      <a-divider />
      <div class="book-detail-wrapper-content">
        <ul class="book-detail-wrapper-content-list">
          <li
            class="book-detail-wrapper-content-list-item"
            v-for="item in detailInfo"
            :key="item.key"
          >
            <span class="book-detail-wrapper-content-list-item-title" v-text="item.title"></span>
            <span class="book-detail-wrapper-content-list-item-content" v-text="item.value"></span>
          </li>
        </ul>
      </div>
    </a-card>
    <!-- 书籍的出库日志/入库日志 -->
    <a-card class="log" title="出入库日志">
      <template #extra>
        <span>
          <CheckOutlined v-if="curLogType === 'IN_COUNT'" />
          <a href="javascript:;" @click="logFilter('IN_COUNT')">入库日志</a>
        </span>
        <span>
          <CheckOutlined v-if="curLogType === 'OUT_COUNT'" />
          <a href="javascript:;" @click="logFilter('OUT_COUNT')">出库日志</a>
        </span>
      </template>
      <div>
        <a-table bordered :pagination="false" :columns="columns" :data-source="log">
          <template #updateAt="{ record }">{{ formatTimestamp(record.meta.updatedAt) }}</template>
        </a-table>
      </div>
      <!-- 分页 -->
      <space-between class="log-pagination">
        <div />
        <a-pagination
          v-model:current="logCurPage"
          :pageSize="pageSize"
          :total="logTotal"
          @change="setLogCurPage"
        />
      </space-between>
    </a-card>

    <update v-model:show="showUpdateDialog" :book="editBook" @update="update" />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { result, formatTimestamp, vueProperties } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import Update from '@/views/Books/components/update.vue'
import { CheckOutlined } from '@ant-design/icons-vue'

const defaultBookDetailData = [
  {
    title: '出版日期',
    key: 'publishDate',
    value: null
  },
  {
    title: '作者',
    key: 'auth',
    value: ''
  },
  {
    title: '库存',
    key: 'count',
    value: 0
  },
  {
    title: '价格',
    key: 'price',
    value: 0
  },
  {
    title: '折扣',
    key: 'm',
    value: ''
  },
  {
    title: '创建时间',
    key: 'create',
    value: ''
  }
]

const columns = [
  {
    title: '数量',
    key: 'num',
    dataIndex: 'num'
  },
  {
    title: '操作时间',
    key: 'updateAt',
    dataIndex: 'updateAt',
    slots: {
      customRender: 'updateAt'
    }
  }
]

const handleDetailData = ({ data, detailInfo, bookName } = {}) => {
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'name') bookName.value = value

    const target = detailInfo.value.find(item => item.key === key)
    if (target) target.value = (target.key === 'publishDate' || target.key === 'create') ? formatTimestamp(value) : value
  })
}

export default defineComponent({
  name: 'BookDetail',
  components: {
    Update,
    CheckOutlined
  },
  setup () {
    const { $service } = vueProperties()
    const route = useRoute()
    const router = useRouter()
    const { id } = route.params && route.params// 从路由参数中获取id
    const bookName = ref('')
    const detailInfo = ref(defaultBookDetailData) // 书籍详情信息书籍
    const showUpdateDialog = ref(false) // 修改图书内容对话框
    const editBook = ref({}) // 编辑图书内容数据

    const logCurPage = ref(1)
    const pageSize = ref(4)
    const logTotal = ref(0)

    onMounted(async () => {
      await getDetail()
      getInventoryLogList()
    })

    // 获取书籍详情信息数据
    const getDetail = async () => {
      const res = await $service.book.detail(id)
      result(res)
        .success((msg, { data }) => {
          editBook.value = data
          // 处理数据
          handleDetailData({ data, detailInfo, bookName })
          message.success(msg)
        })
    }

    const remove = async () => {
      const res = await $service.book.remove(id)
      result(res)
        .success((msg) => {
          message.success(msg)
          router.replace('/books')
        })
    }

    const update = (bookData) => {
      console.log(bookData)
      handleDetailData({ data: bookData, detailInfo, bookName })
    }

    const log = ref([]) // 某本书的出入库日志
    // 获取出入库日志
    const getInventoryLogList = async () => {
      const res = await $service.inventoryLog.getInventoryLogList({
        name: bookName.value,
        type: curLogType.value,
        page: logCurPage.value,
        size: pageSize.value
      })
      result(res)
        .success((msg, { data }) => {
          const { list, size, total } = data
          message.success(msg)
          console.log(data)
          log.value = list.map((item) => {
            item.key = item._id
            return item
          })
          logTotal.value = total
          pageSize.value = size
        })
    }

    // 日志分页切换的时候
    const setLogCurPage = (page) => {
      logCurPage.value = page
      getInventoryLogList()
    }

    const curLogType = ref('IN_COUNT')
    // 筛选出库日志还是入库日志
    const logFilter = (type) => {
      const word = type === 'IN_COUNT' ? '入库' : '出库'
      if (type === curLogType.value) {
        message.warning(`当前已是${word}日志`)
        return
      }
      curLogType.value = type
      // 重置page为第一页
      logCurPage.value = 1
      getInventoryLogList()
    }

    return {
      columns,
      bookName,
      detailInfo,
      editBook,
      showUpdateDialog,
      log,
      logCurPage,
      pageSize,
      logTotal,
      curLogType,

      formatTimestamp,
      remove,
      update,
      setLogCurPage,
      logFilter
    }
  }
})

</script>

<style lang="scss" scoped>
.book-detail-wrapper {
  &-content {
    width: 100%;

    &-list {
      display: flex;
      margin-bottom: 0px;
      flex-wrap: wrap;
      &-item {
        display: flex;
        width: calc(100% / 3);
        min-width: 130px;
        margin-bottom: 18px;
        font-size: 16px;
        &:nth-last-child(-n + 3) {
          margin-bottom: 0px;
        }

        &-title {
          font-weight: bold;
          color: rgba($color: #000000, $alpha: 1);
          min-width: 80px;
        }
      }
    }
  }
}

.book-detail {
  &-title {
    min-width: 98px;
    font-weight: bolder;
    font-size: 24px;
  }
  &-operation {
    display: flex;
    align-items: center;
    &-btn:last-child {
      margin-left: 6px;
    }
  }
}

.log {
  margin-top: 24px;
  &:deep(".ant-card-head-title") {
    font-weight: bold;
  }
  span {
    display: inline-block;
    color: #1890ff;

    &:nth-of-type(n + 2) {
      margin-left: 12px;
    }
  }
  &-pagination {
    margin-top: 24px;
  }
}
</style>
