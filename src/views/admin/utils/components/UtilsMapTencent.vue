<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'

export default {
  name: 'UtilsMapTencent',
  components: {},
  data() {
    return {
      src: 'https://lbs.qq.com/tool/getpoint/index.html',
      height: 500
    }
  },
  created() {
    this.height = screenHeight(230)
  },
  methods: {}
}
</script>
