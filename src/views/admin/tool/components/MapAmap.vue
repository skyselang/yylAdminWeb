<template>
  <iframe src="https://lbs.amap.com/console/show/picker" frameborder="0" width="100%" :height="curHeight" />
</template>

<script>
export default {
  name: 'MapAmap',
  components: {},
  data() {
    return {
      curHeight: 500
    }
  },
  created() {
    this.beforeMount(180)
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
