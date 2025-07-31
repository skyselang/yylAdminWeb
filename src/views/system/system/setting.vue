<template>
  <div class="app-container">
    <Setting />
  </div>
</template>

<script>
import { hasPerm } from '@/utils/index'
import Setting from './component/Setting.vue'

export default {
  name: 'SystemSetting',
  components: { Setting },
  data() {
    return {
      name: '设置'
    }
  },
  methods: {
    hasPerm
  }
}
</script>
