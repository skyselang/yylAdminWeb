<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'

export default {
  name: 'UtilsMapBaidu',
  components: {},
  data() {
    return {
      name: '百度地图',
      height: 500,
      src: 'https://api.map.baidu.com/lbsapi/getpoint/index.html'
    }
  },
  created() {
    this.height = screenHeight(230)
  },
  methods: {}
}
</script>
