<template>
  <div class="flex-end">
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FlexEnd'
})

</script>

<style lang="scss" scoped>
.flex-end {
  display: flex;
  justify-content: flex-end;
}
</style>
