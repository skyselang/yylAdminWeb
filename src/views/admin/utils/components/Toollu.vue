<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'

export default {
  name: 'Toollu',
  components: {},
  data() {
    return {
      src: 'https://tool.lu/',
      height: 600
    }
  },
  created() {
    this.height = screenHeight(190)
  },
  methods: {}
}
</script>
