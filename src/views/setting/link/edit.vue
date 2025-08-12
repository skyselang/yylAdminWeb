<template>
  <AddEdit :id="id" type="edit" />
</template>

<script>
import AddEdit from './component/AddEdit.vue'

export default {
  name: 'SettingLinkEdit',
  components: { AddEdit },
  data() {
    return {
      id: this.$route.params?.id
    }
  }
}
</script>
