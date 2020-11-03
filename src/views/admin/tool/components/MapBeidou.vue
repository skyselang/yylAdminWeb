<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'
export default {
  name: 'MapBeidou',
  components: {},
  data() {
    return {
      src: 'http://www.beidou.gov.cn/',
      height: 500
    }
  },
  created() {
    this.height = screenHeight(180)
  },
  methods: {}
}
</script>
