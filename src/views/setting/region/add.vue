<template>
  <AddEdit :pid="pid" />
</template>

<script>
import AddEdit from './component/AddEdit.vue'

export default {
  name: 'SettingRegionAdd',
  components: { AddEdit },
  data() {
    return {
      pid: this.$route.params?.pid
    }
  }
}
</script>
