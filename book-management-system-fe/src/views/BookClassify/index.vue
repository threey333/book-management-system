<template>
  <div class="book-classify-wrapper">
    <a-card title="分类管理" :headStyle="cartHeadTitle">
      <div class="book-classify-wrapper-top">
        <a-input v-model:value="title" placeholder="输入书籍分类" />
        <a-button @click="add" type="primary">添加</a-button>
      </div>
      <a-divider />
      <!-- 表格 -->
      <a-table bordered :pagination="false" :columns="columns" :data-source="bookClassifyList">
        <template #actions="{ record }">
          <a-button type="primary" size="small" @click="updateTitle(record)">修改</a-button>&nbsp;&nbsp;
          <a-button type="primary" size="small" danger @click="remove(record)">删除</a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { result } from '@/utils'
import { message, Input } from 'ant-design-vue'
import { service } from '@/service'
import ElDialog from '@/components/dialog/index.vue'

const columns = [
  {
    title: '分类',
    dataIndex: 'title',
    key: 'title'
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
  name: 'BookClassify',
  setup () {
    // 设置title样式
    const cartHeadTitle = ref({
      'font-weight': 'bold',
      'font-size': '24px',
      'text-align': 'left'
    })
    const title = ref('')
    const bookClassifyList = ref([])

    const getBookClassifyList = async () => {
      const res = await service.bookClassify.bookClassifyList()
      result(res)
        .success((msg, { data }) => {
          message.success(msg)
          bookClassifyList.value = data.map(item => {
            const key = item._id
            return {
              ...item,
              key
            }
          })
        })
    }

    // 添加图书分类
    const add = async () => {
      if (title.value === '') {
        message.info('请输入正确的书籍分类名称')
        return
      }
      const res = await service.bookClassify.addBookClassifyList({
        title: title.value
      })
      result(res)
        .success((msg, { data }) => {
          message.success(msg)
          bookClassifyList.value.unshift(data)
          console.log(data)
          title.value = ''
        })
    }

    // 更改图书分类
    const updateTitle = async ({ _id }) => {
      ElDialog.confirm({
        title: '请输入新的分类名称',
        content: (
          <div>
            <Input class="_book_classify_new_title" />
          </div>
        ),
        onOk: async () => {
          const el = document.querySelector('._book_classify_new_title')
          const title = el && el.value

          const res = await service.bookClassify.updateClassifyTitle({
            id: _id,
            title
          })
          result(res)
            .success((msg) => {
              message.success(msg)
              const target = bookClassifyList.value.find(item => item._id === _id)
              target.title = title
              console.log(target)
            })
        }
      })
    }

    // 删除某图书分类
    const remove = async ({ _id }) => {
      const res = await service.bookClassify.removeClassify(_id)
      result(res)
        .success((msg) => {
          message.success(msg)
          const index = bookClassifyList.value.findIndex(item => item._id === _id)
          bookClassifyList.value.splice(index, 1)
        })
    }

    onMounted(() => {
      getBookClassifyList()
    })

    return {
      columns,
      cartHeadTitle,
      title,
      bookClassifyList,

      add,
      updateTitle,
      remove
    }
  }
})

</script>

<style lang="scss" scoped>
.book-classify-wrapper {
  &-top {
    display: inline-flex;
    input {
      width: 200px;
    }

    button {
      margin-left: 15px;
    }
  }
}
</style>
