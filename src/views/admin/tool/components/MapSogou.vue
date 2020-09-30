<template>
  <iframe src="https://map.sogou.com/api/documentation/javascript/api2.5/examples_doc/event-arguments.html" frameborder="0" width="100%" :height="curHeight" />
</template>

<script>
export default {
  name: 'MapSogou',
  components: {},
  data() {
    return {
      curHeight: 500
    }
  },
  created() {
    this.beforeMount(190)
  },
  methods: {
    // 获取屏幕高度
    beforeMount(height) {
      var h =
        document.documentElement.clientHeight || document.body.clientHeight
      this.curHeight = h - height
    }
  }
}
</script>
