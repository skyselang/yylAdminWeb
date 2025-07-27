<template>
  <AddEdit :id="id" />
</template>

<script>
import AddEdit from './component/AddEdit.vue'

export default {
  name: 'FileTagEdit',
  components: { AddEdit },
  data() {
    return {
      id: this.$route.params?.id
    }
  }
}
</script>
