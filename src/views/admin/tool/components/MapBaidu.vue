<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'
export default {
  name: 'MapBaidu',
  components: {},
  data() {
    return {
      src: 'https://api.map.baidu.com/lbsapi/getpoint/index.html',
      height: 500
    }
  },
  created() {
    this.height = screenHeight(180)
  },
  methods: {}
}
</script>
