<template>
  <div class="add-one">
    <el-dialog :visible="show" title="编辑书籍" @confirm-submission="submit" @close-dialog="close">
      <!-- 使用默认插槽 -->
      <template v-slot:default>
        <a-form :model="editForm" :label-col="{ span: 4 }">
          <a-form-item label="书名">
            <a-input v-model:value="editForm.name" />
          </a-form-item>
          <a-form-item label="价格">
            <a-input-number v-model:value="editForm.price" :min="0" />
          </a-form-item>
          <a-form-item label="作者">
            <a-input v-model:value="editForm.auth" />
          </a-form-item>
          <a-form-item label="出版日期">
            <a-date-picker v-model:value="editForm.publishDate" />
          </a-form-item>
          <a-form-item label="分类">
            <a-input v-model:value="editForm.classify" />
          </a-form-item>
        </a-form>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import moment from 'moment'
import { vueProperties, result } from '@/utils'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'Update',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    book: {
      type: Object,
      request: true,
      defaule: () => ({})
    }
  },
  setup (props, context) {
    const { $service } = vueProperties()

    const editForm = reactive({
      name: '',
      price: 0,
      auth: '',
      publishDate: null,
      classify: ''
    })
    const oldBookName = ref('')

    watch(() => props.book, (current) => {
      oldBookName.value = current.name
      Object.assign(editForm, current)
      editForm.publishDate = moment(Number(editForm.publishDate))
    })

    const submit = async () => {
      if (oldBookName.value !== editForm.name) {
        // 修改出入库日志中的图书名字
        $service.inventoryLog.updateLogBookName({
          oldBookName: oldBookName.value,
          newBookName: editForm.name
        })
      }
      const res = await $service.book.update({
        id: props.book._id,
        name: editForm.name,
        price: editForm.price,
        auth: editForm.auth,
        publishDate: editForm.publishDate && editForm.publishDate.valueOf(),
        classify: editForm.classify
      })
      result(res)
        .success((msg, { data }) => {
          context.emit('update', data)
          message.success(msg)
          close()
        })
    }
    // 关闭对话框
    const close = () => {
      context.emit('update:show', false)
    }

    return {
      editForm,

      submit,
      close
    }
  }
})

</script>

<style lang="scss" scoped>
</style>
