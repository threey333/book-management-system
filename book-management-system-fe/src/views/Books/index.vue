<template>
  <div class="books-wrapper">
    <a-card :title="simple ? '最近添加的图书' : ''" :headStyle="cartHeadTitle">
      <template v-if="!simple">
        <h2>图书列表</h2>
        <a-divider />
        <space-between class="books-wrapper-operation">
          <div class="search">
            <a-input-search
              placeholder="根据书名搜索"
              v-model:value="keyword"
              enter-button
              @search="onSearch"
            />
            <a v-if="isBack" href="javascript:;" @click="backAll">返回</a>
          </div>
          <div class="actions">
            <a-button @click="show = true" type="primary">添加一条</a-button>&nbsp;
            <a-upload
              @change="onUploadChange"
              action="http://localhost:9090/upload/file"
              :headers="headers"
            >
              <a-button type="primary" ghost>
                <UploadOutlined />上次 Excel 添加
              </a-button>
            </a-upload>
          </div>
        </space-between>
        <a-divider />
      </template>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="listData"
        :pagination="false"
        bordered
        :scroll="{ x: 'max-content' }"
      >
        <template #publishDate="data">{{ formatTimestamp(data.record.publishDate) }}</template>

        <template #classify="{ record }">{{ getClassifyTitleById(record.classify) }}</template>
        <template #count="data">
          <a href="javascript:;" @click="updateCount('IN_COUNT', data.record)">入库</a>
          {{ data.record.count }}
          <a
            href="javascript:;"
            @click="updateCount('OUT_COUNT', data.record)"
          >出库</a>
        </template>
        <template #actions="data" v-if="!simple">
          <a href="javascript:;" @click="toDetail(data)">详情</a>
          &nbsp;
          <a href="javascript:;" @click="update(data)">编辑</a>
          &nbsp;
          <a href="javascript:;" @click="removeItem(data)">删除</a>
        </template>
      </a-table>
      <flex-end class="books-wrapper-pagination" v-if="!simple">
        <!-- 分页 -->
        <a-pagination
          v-model:current="curPage"
          :pageSize="pageSize"
          :total="total"
          @change="setCurPage"
        />
      </flex-end>
    </a-card>
    <AddOne v-model:show="show" @getList="getList" />
    <Update v-model:show="showUpdateDialog" :book="curEditBook" @update="updateCurBook"></Update>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { vueProperties, result, formatTimestamp } from '@/utils'
import { UploadOutlined } from '@ant-design/icons-vue'
import AddOne from './components/add-one.vue'
import Update from './components/update.vue'
import { message, Input } from 'ant-design-vue'
import ElDialog from '@/components/dialog/index.vue'
import { getClassifyTitleById } from '@/utils/book-classify'
import { getHeaders } from '@/utils/request.js'

export default defineComponent({
  name: 'Books',
  components: {
    AddOne,
    Update,
    UploadOutlined
  },
  props: {
    simple: Boolean
  },
  setup (props) {
    // 设置title样式
    const cartHeadTitle = ref({
      'font-weight': 'bold',
      'font-size': '24px',
      'text-align': 'left'
    })

    const columns = [
      {
        title: '书名',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '作者',
        key: 'auth',
        dataIndex: 'auth'
      },
      {
        title: '价格',
        key: 'price',
        dataIndex: 'price'
      },
      {
        title: '库存',
        key: 'count',
        dataIndex: 'count',
        slots: {
          customRender: 'count'
        }
      },
      {
        title: '出版日期',
        key: 'publishDate',
        dataIndex: 'publishDate',
        slots: {
          customRender: 'publishDate'
        }
      },
      {
        title: '分类',
        key: 'classify',
        dataIndex: 'classify',
        slots: {
          customRender: 'classify'
        }
      }
    ]

    const { $service } = vueProperties()
    const show = ref(false)
    const showUpdateDialog = ref(false)
    const listData = ref([]) // 图书列表数量
    const total = ref(0) // 图书类总条数
    const curPage = ref(1) // 当前页数
    const pageSize = ref(10) // 当前页有多少条数据
    const keyword = ref('') // 搜索的关键词
    const isBack = ref('')

    if (!props.simple) {
      columns.push({
        title: '操作',
        key: 'actions',
        dataIndex: 'actions',
        slots: {
          customRender: 'actions'
        }
      })
    }

    // 获取图书列表数据
    const getList = async ({ page } = {}) => {
      const res = await $service.book.getList({
        page: page || curPage.value,
        size: pageSize.value,
        keyword: keyword.value
      })
      result(res).success((msg, { data }) => {
        listData.value = data.list.map((item) => {
          item.key = item._id
          return item
        })
        total.value = data.total
        pageSize.value = Number(data.size)
        message.success(msg)
      })
    }

    onMounted(() => {
      getList()
    })

    // 设置当前页码
    const setCurPage = (page) => {
      curPage.value = page
      getList()
    }

    // 搜索
    const onSearch = () => {
      keyword.value = keyword.value.replace(/(^\s*) | (\s*$)/g, '')
      if (!keyword.value) {
        keyword.value = ''
        return
      }
      getList()
      isBack.value = !!keyword.value
    }

    // 返回搜索之前的结果
    const backAll = () => {
      keyword.value = ''
      isBack.value = false
      getList()
    }

    // 删除某一本图书信息记录
    const removeItem = async ({ record }) => {
      const { _id } = record
      const res = await $service.book.remove(_id)
      console.log(res)
      result(res).success((msg, { data: { total: t } }) => {
        message.success(msg)
        const idx = listData.value.findIndex((item) => item._id === _id)
        const remain = t % pageSize.value
        if (remain === 0) {
          const newCurPage = t / pageSize.value
          console.log(newCurPage)
          getList({
            page: newCurPage
          })
        } else {
          listData.value.splice(idx, 1)
        }
      })
    }

    // 修改图书库存
    const updateCount = (type, record) => {
      const word = type === 'OUT_COUNT' ? '减少' : '增加'

      ElDialog.confirm({
        title: `要${word}多少库存`,
        content: (
          <div>
            <Input type="number" class="__book_input_count" />
          </div>
        ),
        onOk: async () => {
          const el = document.querySelector('.__book_input_count')
          let num = el.value
          const res = await $service.book.updateCount({
            id: record._id,
            type,
            num
          })
          result(res)
            .success((msg, data) => {
              num = type === 'OUT_COUNT' ? -Math.abs(num) : Math.abs(num)
              const one = listData.value.find(item => item._id === record._id)
              one.count = one.count + num
              message.success((`成功${word} ${Math.abs(num)} 本书`))
            })
        }
      })
    }

    // 编辑图书内容数据
    const curEditBook = ref({})
    // 编辑显示书籍的弹框
    const update = ({ record }) => {
      showUpdateDialog.value = true
      curEditBook.value = record
    }

    // 更新列表某一行的数据
    const updateCurBook = (newData) => {
      Object.assign(curEditBook.value, newData)
    }

    const router = useRouter()
    // 进入书籍的详情页
    const toDetail = ({ record }) => {
      const { _id } = record // 获取该书籍的_id
      console.log(router)
      router.push(`/books/${_id}`)
    }
    // 上传文件
    const onUploadChange = ({ file }) => {
      if (file.response) {
        result(file.response)
          .success(async (msg, { data: key }) => {
            const res = await $service.book.addManyBook(key)

            result(res)
              .success((msg, { data: { addCount } }) => {
                message.success(`成功添加 ${addCount} 本书籍`)

                getList()
              })
          })
      }
    }

    return {
      columns,
      cartHeadTitle,
      show,
      listData,
      formatTimestamp,
      curPage,
      pageSize,
      total,
      keyword,
      isBack,
      showUpdateDialog,
      curEditBook,
      headers: getHeaders(),

      setCurPage,
      onSearch,
      backAll,
      removeItem,
      updateCount,
      update,
      updateCurBook,
      toDetail,
      getClassifyTitleById,
      getList,
      onUploadChange
    }
  }
})

</script>

<style lang="scss" scoped>
.books-wrapper {
  &-pagination {
    margin-top: 24px;
  }
}
.search {
  display: flex;
  align-items: center;
  // width: 300px;
  min-width: 244px;
  max-width: 244px;
  a {
    display: block;
    margin-left: 16px;
    min-width: 40px;
  }
}
</style>
