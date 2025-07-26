<template>
  <AddEdit :id="id" />
</template>

<script>
import AddEdit from './component/AddEdit.vue'

export default {
  name: 'MemberThirdEdit',
  components: { AddEdit },
  data() {
    return {
      id: this.$route.params?.id
    }
  }
}
</script>
