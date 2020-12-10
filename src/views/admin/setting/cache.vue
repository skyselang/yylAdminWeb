<template>
  <div class="app-container">
    <el-card v-loading="cacheLoad" class="box-card">
      <el-form ref="cacheRef" label-width="120px">
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
              <el-button title="刷新信息" @click="cacheRefresh()">刷新</el-button>
              <el-button type="primary" title="清空缓存" @click="cacheClear()">清空</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { settingCache } from '@/api/admin'

export default {
  name: 'SettingCache',
  components: {},
  data() {
    return {
      cacheLoad: false,
      cacheModel: {}
    }
  },
  created() {
    this.cacheGet()
  },
  methods: {
    // 获取
    cacheGet() {
      settingCache().then(res => {
        this.cacheModel = res.data
      })
    },
    // 刷新
    cacheRefresh() {
      this.cacheLoad = true
      settingCache()
        .then(res => {
          this.cacheModel = res.data
          this.cacheLoad = false
          this.$message({ message: res.msg, type: 'success' })
        })
        .catch(() => {
          this.cacheLoad = false
        })
    },
    // 清空
    cacheClear() {
      this.cacheLoad = true
      settingCache({}, 'post')
        .then(res => {
          this.cacheGet()
          this.cacheLoad = false
          this.$message({ message: res.msg, type: 'success' })
        })
        .catch(() => {
          this.cacheLoad = false
        })
    }
  }
}
</script>
