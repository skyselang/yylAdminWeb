<template>
  <el-card class="box-card">
    <el-row :gutter="0">
      <el-col :xs="24" :sm="18" :md="12">
        <el-form ref="ref" :model="model" label-width="120px">
          <el-form-item label="" prop="">
            <span>手动清除所有缓存（后台登录状态不会清除）。</span>
          </el-form-item>
          <el-form-item label="缓存类型" prop="type">
            <el-input v-model="model.type" />
          </el-form-item>
          <el-form-item label="">
            <el-button :loading="loading" @click="refresh()">刷新</el-button>
            <el-button :loading="loading" type="primary" title="清除缓存" @click="submit()">清除</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { cacheInfo, cacheClear } from '@/api/admin/setting'

export default {
  name: 'AdminSettingCache',
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
    // 刷新
    refresh() {
      this.loading = true
      cacheInfo()
        .then((res) => {
          this.model = res.data
          this.loading = false
          this.$message.success(res.msg)
        })
        .catch(() => {
          this.loading = false
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
