<template>
  <el-card class="box-card">
    <el-form ref="ref" :model="model" label-width="120px">
      <el-form-item label="缓存类型" prop="type">
        <el-input v-model="model.type" />
      </el-form-item>
      <el-form-item label="" prop="">
        <span>手动清除所有缓存（后台登录状态不会清除）。</span>
      </el-form-item>
      <el-form-item label="">
        <el-button :loading="loading" type="primary" title="清除缓存" @click="submit()">清除</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { cacheInfo, cacheClear } from '@/api/admin-setting'

export default {
  name: 'Cache',
  components: {},
  data() {
    return {
      loading: false,
      model: {
        type: ''
      },
      rules: {}
    }
  },
  created() {
    this.info()
  },
  methods: {
    // 信息
    info() {
      cacheInfo().then(res => {
        this.model = res.data
      })
    },
    // 清空
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          cacheClear().then(res => {
            this.info()
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
