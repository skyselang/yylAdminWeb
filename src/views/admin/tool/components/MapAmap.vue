<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'
export default {
  name: 'MapAmap',
  components: {},
  data() {
    return {
      src: 'https://lbs.amap.com/console/show/picker',
      height: 500
    }
  },
  created() {
    this.height = screenHeight(180)
  },
  methods: {}
}
</script>
