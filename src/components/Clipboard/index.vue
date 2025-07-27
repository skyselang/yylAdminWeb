<template>
  <el-button :text="text" :title="title" @click="copy">
    <el-icon :color="color"><CopyDocument /></el-icon>
  </el-button>
</template>

<script>
import { clipboard } from '@/utils/index'
import { CopyDocument } from '@element-plus/icons-vue'

export default {
  name: 'Clipboard',
  components: { CopyDocument },
  props: {
    content: {
      type: String,
      default: ''
    },
    text: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: ''
    }
  },
  created() {
    this.title = this.$t('复制')
  },
  methods: {
    copy() {
      clipboard(this.content)
    }
  }
}
</script>
