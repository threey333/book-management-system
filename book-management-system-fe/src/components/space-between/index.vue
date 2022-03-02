<template>
  <div class="space-between">
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SpaceBetween'
})
</script>

<style lang="scss" scoped>
.space-between {
  display: flex;
  justify-content: space-between;
}
</style>
