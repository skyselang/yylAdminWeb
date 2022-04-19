<template>
  <file-manage :is-recycle="recycle" />
</template>

<script>
import FileManage from '@/components/FileManage'

export default {
  name: 'FileFile',
  components: { FileManage },
  data() {
    return {
      name: '文件管理',
      recycle: 0 // 是否回收站
    }
  },
  watch: {
    $route(to) {
      if (typeof to.meta.query !== 'undefined') {
        if (typeof to.meta.query.recycle !== 'undefined') {
          this.recycle = to.meta.query.recycle
        }
      }
    }
  },
  created() {
    this.recycle = this.$route.meta.query.recycle
  },
  methods: {}
}
</script>

<style scoped>

</style>
