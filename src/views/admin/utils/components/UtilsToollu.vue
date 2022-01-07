<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'

export default {
  name: 'UtilsToollu',
  components: {},
  data() {
    return {
      height: 600,
      src: 'https://tool.lu/'
    }
  },
  created() {
    this.height = screenHeight(180)
  },
  methods: {}
}
</script>
