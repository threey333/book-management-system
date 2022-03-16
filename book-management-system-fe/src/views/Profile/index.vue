<template>
  <div class="profile-wrapper">
    <reset-password />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ResetPassword from './components/reset-password.vue'
export default defineComponent({
  name: 'Profile',
  components: {
    ResetPassword
  }
})

</script>

<style lang="scss" scoped>
</style>
