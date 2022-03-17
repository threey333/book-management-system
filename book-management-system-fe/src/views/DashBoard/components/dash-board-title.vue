<template>
  <div class="title-wrapper">
    <div class="title-wrapper-item">
      <div class="title-wrapper-item-count">共 {{ baseInfo.book }} 本</div>
      <div class="title-wrapper-item-title">书籍</div>
    </div>
    <div class="title-wrapper-item">
      <div class="title-wrapper-item-count">共 {{ baseInfo.user }} 位</div>
      <div class="title-wrapper-item-title">用户</div>
    </div>
    <div class="title-wrapper-item">
      <div class="title-wrapper-item-count">共 {{ baseInfo.log }} 条</div>
      <div class="title-wrapper-item-title">日志</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DashBoardTitle',
  props: {
    baseInfo: {
      type: Object,
      default: () => {
        return {
          book: 0,
          user: 0,
          log: 0
        }
      }
    }
  }
})

</script>

<style lang="scss" scoped>
.title-wrapper {
  display: flex;
  text-align: center;
  &-item {
    flex: 1;
    &-title {
      font-size: 16px;
      color: #666;
    }
    &-count {
      font-weight: 600;
      font-size: 24px;
      color: #000;
    }
  }
}
</style>
