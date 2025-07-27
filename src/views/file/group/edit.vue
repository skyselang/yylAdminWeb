<template>
  <AddEdit :id="id" />
</template>

<script>
import AddEdit from './component/AddEdit.vue'

export default {
  name: 'FileGroupEdit',
  components: { AddEdit },
  data() {
    return {
      id: this.$route.params?.id
    }
  }
}
</script>
