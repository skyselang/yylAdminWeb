<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'

export default {
  name: 'UtilsMapBeidou',
  components: {},
  data() {
    return {
      name: '北斗导航',
      height: 500,
      src: 'http://www.beidou.gov.cn/'
    }
  },
  created() {
    this.height = screenHeight(230)
  },
  methods: {}
}
</script>
