<template>
  <AddEdit :pid="pid" />
</template>

<script>
import AddEdit from './component/AddEdit.vue'

export default {
  name: 'ContentCategoryAdd',
  components: { AddEdit },
  data() {
    return {
      pid: this.$route.params?.pid
    }
  }
}
</script>
