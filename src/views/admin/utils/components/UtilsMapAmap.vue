<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'

export default {
  name: 'UtilsMapAmap',
  components: {},
  data() {
    return {
      name: '高德地图',
      height: 500,
      src: 'https://lbs.amap.com/console/show/picker'
    }
  },
  created() {
    this.height = screenHeight(230)
  },
  methods: {}
}
</script>
