<template>
  <el-row>
    <el-col :span="16">
      <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
        <el-form-item label="缓存类型" prop="cache_type">
          <el-col :span="8">
            <el-text>{{ model.cache_type }}</el-text>
          </el-col>
        </el-form-item>
        <el-form-item> <el-text>用户和会员登录状态不会清除。</el-text></el-form-item>
        <el-form-item>
          <el-button :loading="loading" @click="refresh()">刷新</el-button>
          <el-button :loading="loading" type="primary" @click="clear()">清除</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { cacheInfo, cacheClear } from '@/api/system/setting'

export default {
  name: 'SystemSettingCache',
  data() {
    return {
      name: '缓存设置',
      height: 680,
      loading: false,
      model: {
        cache_type: ''
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(210)
    this.info()
  },
  methods: {
    // 信息
    info() {
      cacheInfo().then((res) => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      cacheInfo()
        .then((res) => {
          this.model = res.data
          this.loading = false
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 清除
    clear() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          cacheClear()
            .then((res) => {
              this.loading = false
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
