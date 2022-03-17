<template>
  <div class="table-wrapper">
    <div class="table-wrapper-list">
      <div class="table-wrapper-list-left">
        <Books :simple="simple" />
      </div>
      <div class="table-wrapper-list-right">
        <log :simple="simple" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import Books from '@/views/Books'
import Log from '@/views/Log'

export default defineComponent({
  name: 'DashBoardTable',
  components: {
    Books,
    Log
  },
  setup () {
    const simple = ref(true)
    return {
      simple
    }
  }
})

</script>

<style lang="scss" scoped>
.table-wrapper {
  margin-top: 24px;
  &-list {
    display: flex;
    &-left {
      flex: 1;
      margin-right: 12px;
    }
    &-right {
      flex: 1;
      margin-left: 12px;
    }
  }
}
</style>
