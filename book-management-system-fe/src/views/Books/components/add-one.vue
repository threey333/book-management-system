<template>
  <div class="add-one">
    <el-dialog :visible="show" @confirm-submission="submit" @close-dialog="close">
      <!-- 使用默认插槽 -->
      <template v-slot:default>
        <a-form :model="formData" :label-col="{ span: 4 }">
          <a-form-item label="书名">
            <a-input v-model:value="formData.name" />
          </a-form-item>
          <a-form-item label="价格">
            <a-input-number v-model:value="formData.price" :min="0" />
          </a-form-item>
          <a-form-item label="作者">
            <a-input v-model:value="formData.auth" />
          </a-form-item>
          <a-form-item label="出版日期">
            <a-date-picker v-model:value="formData.publishDate" />
          </a-form-item>
          <a-form-item label="分类">
            <a-select v-model:value="formData.classify" style="width: 120px">
              <a-select-option
                v-for="item in store.bookClassify"
                :key="item._id"
                :value="item._id"
              >{{ item.title }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="库存">
            <a-input v-model:value="formData.count" />
          </a-form-item>
        </a-form>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { vueProperties, result, clone } from '@/utils'
import { message } from 'ant-design-vue'
import store from '@/store'

const defaultFormData = {
  name: '',
  price: 0,
  auth: '',
  publishDate: null, // 选择时间后是moment对象
  classify: '',
  count: 0
}

export default defineComponent({
  name: 'AddOne',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup (props, context) {
    const { $service } = vueProperties()

    const formData = reactive(clone(defaultFormData))
    if (store.state.bookClassify.length) {
      formData.classify = store.state.bookClassify[0]._id
    }

    // 确认提交
    const submit = async () => {
      const cloneFormData = clone(formData)
      cloneFormData.publishDate = (formData && formData.publishDate && formData.publishDate.valueOf()) || new Date().getTime()
      const res = await $service.book.add(cloneFormData)
      result(res)
        .success((msg) => {
          Object.assign(formData, defaultFormData)
          message.success(msg)

          context.emit('getList')
          close()
        })
    }

    const close = () => {
      context.emit('update:show', false)
    }

    return {
      formData,
      submit,
      close,
      store: store.state
    }
  }
})

</script>

<style lang="scss" scoped>
</style>
