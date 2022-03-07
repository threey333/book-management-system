<template>
  <a-modal
    :visible="show"
    :title="title"
    :maskClosable="isMaskClosable"
    :centered="isCenter"
    @ok="submit"
    @cancel="close"
  >
    <slot />
  </a-modal>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: '添加书籍'
    },
    show: {
      // 对话框的显示与隐藏
      type: Boolean,
      defalut: false
    },
    isCenter: {
      // 是否垂直居中显示对话框
      type: Boolean,
      default: true
    },
    isMaskClosable: {
      // 点击蒙层是否允许关闭
      type: Boolean,
      default: false
    }
  },
  components: {
    'a-modal': Modal
  },
  setup (props, context) {
    const submit = () => {
      context.emit('confirm-submission')
    }
    const close = () => {
      context.emit('close-dialog')
    }

    return {
      submit,
      close
    }
  },
  confirm (props) {
    return Modal.confirm(props)
  },
  info (props) {
    return Modal.info(props)
  },
  success (props) {
    return Modal.success(props)
  },
  err (props) {
    return Modal.err(props)
  },
  warning (props) {
    return Modal.warning(props)
  }

})

</script>

<style lang="scss" scoped>
</style>
