<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form ref="formRef" label-width="100px">
          <el-form-item label="缓存清除">
            <el-button :loading="cacheClearLoad" type="primary" @click="cacheClear()">清除</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { settingCache } from '@/api/admin'

export default {
  name: 'Cache',
  components: {},
  data() {
    return {
      cacheClearLoad: false
    }
  },
  computed: {},
  methods: {
    // 缓存清除
    cacheClear() {
      this.cacheClearLoad = true
      settingCache()
        .then(res => {
          this.cacheClearLoad = false
          this.$message({ message: res.msg, type: 'success' })
        })
        .catch(() => {
          this.cacheClearLoad = false
        })
    }
  }
}
</script>
