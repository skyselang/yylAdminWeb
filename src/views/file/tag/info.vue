<template>
  <AddEdit :id="id" type="info" />
</template>

<script>
import AddEdit from './component/AddEdit.vue'

export default {
  name: 'FileTagInfo',
  components: { AddEdit },
  data() {
    return {
      id: this.$route.params?.id
    }
  }
}
</script>
