<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form ref="formRef" label-width="100px">
          <el-row>
            <el-col :xs="24" :sm="12">
              <el-form-item label="Redis" prop="">
                <el-input v-model="cacheModel.redis_version" type="text" />
              </el-form-item>
              <el-form-item label="运行时长" prop="">
                <el-input v-model="cacheModel.uptime_in_days" type="text" />
              </el-form-item>
              <el-form-item label="已用内存" prop="">
                <el-input v-model="cacheModel.used_memory_human" type="text" />
              </el-form-item>
              <el-form-item label="峰值内存" prop="">
                <el-input v-model="cacheModel.used_memory_peak_human" type="text" />
              </el-form-item>
              <el-form-item label="Lua内存" prop="">
                <el-input v-model="cacheModel.used_memory_lua_human" type="text" />
              </el-form-item>
              <el-form-item label="客户端数" prop="">
                <el-input v-model="cacheModel.connected_clients" type="text" />
              </el-form-item>
              <el-form-item label="总连接数" prop="">
                <el-input v-model="cacheModel.total_connections_received" type="text" />
              </el-form-item>
              <el-form-item label="总命令数" prop="">
                <el-input v-model="cacheModel.total_commands_processed" type="text" />
              </el-form-item>
              <el-form-item label="DB0" prop="">
                <el-input v-model="cacheModel.db0" type="text" />
              </el-form-item>
              <el-form-item label="">
                <el-button :loading="loading" title="刷新信息" @click="cacheClearGet()">刷新</el-button>
                <el-button :loading="loading" type="primary" title="清空缓存" @click="cacheClearPost()">清空</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { settingCache } from '@/api/admin'

export default {
  name: 'SettingCache',
  components: {},
  data() {
    return {
      loading: false,
      cacheModel: {}
    }
  },
  created() {
    this.cacheClearGet()
  },
  methods: {
    // 获取/刷新
    cacheClearGet() {
      this.loading = true
      settingCache()
        .then(res => {
          this.loading = false
          this.cacheModel = res.data
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 清空
    cacheClearPost() {
      this.loading = true
      settingCache({}, 'post')
        .then(res => {
          this.loading = false
          this.$message({ message: res.msg, type: 'success' })
          this.cacheClearGet()
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
