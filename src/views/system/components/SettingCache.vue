<template>
  <el-card class="dialog-body" :style="{height:height+'px'}">
    <el-row>
      <el-col :span="14">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="缓存类型" prop="cache_type">
            <el-col :span="8">
              <el-input v-model="model.cache_type" />
            </el-col>
          </el-form-item>
          <el-form-item label="" prop="">
            <el-col :span="12">
              手动清除所有缓存，后台登录状态不会清除。
            </el-col>
          </el-form-item>
          <el-form-item label="">
            <el-button :loading="loading" @click="refresh()">刷新</el-button>
            <el-button :loading="loading" type="primary" @click="clear()">清除</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { cacheInfo, cacheClear } from '@/api/system/setting'

export default {
  name: 'SystemSettingCache',
  components: {},
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
    this.height = screenHeight(180)
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
      cacheInfo().then((res) => {
        this.model = res.data
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 清除
    clear() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          cacheClear().then(res => {
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
