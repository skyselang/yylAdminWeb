<template>
  <iframe :src="src" frameborder="0" width="100%" :height="height" />
</template>

<script>
import screenHeight from '@/utils/screen-height'

export default {
  name: 'UtilsMapSogou',
  components: {},
  data() {
    return {
      src: 'https://map.sogou.com/api/documentation/javascript/api2.5/examples_doc/event-arguments.html',
      height: 500
    }
  },
  created() {
    this.height = screenHeight(230)
  },
  methods: {}
}
</script>
