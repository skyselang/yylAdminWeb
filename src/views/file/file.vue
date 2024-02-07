<template>
  <FileManage />
</template>

<script>
import FileManage from '@/components/FileManage/index.vue'

export default {
  name: 'FileFile',
  components: { FileManage },
  data() {
    return {
      name: '文件管理'
    }
  }
}
</script>
