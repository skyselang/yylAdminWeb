<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'

export default {
  name: 'UtilsHuatools',
  components: {},
  data() {
    return {
      name: 'IT在线工具',
      height: 600,
      src: 'https://www.huatools.com/'
    }
  },
  created() {
    this.height = screenHeight(180)
  },
  methods: {}
}
</script>
