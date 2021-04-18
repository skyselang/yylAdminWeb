<template>
  <div class="app-container">
    <el-card v-loading="loading" class="box-card" :style="{height:height+130+'px', overflow:'auto'}">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form :model="model" label-width="130px">
            <el-form-item label="缓存类型" prop="type">
              <el-input v-model="model.type" />
            </el-form-item>
            <div v-if="model.type === 'redis'">
              <el-form-item label="Redis" prop="">
                <el-input v-model="model.redis_version" />
              </el-form-item>
              <el-form-item label="运行时长" prop="">
                <el-input v-model="model.uptime_in_days" />
              </el-form-item>
              <el-form-item label="已用内存" prop="">
                <el-input v-model="model.used_memory_human" />
              </el-form-item>
              <el-form-item label="峰值内存" prop="">
                <el-input v-model="model.used_memory_peak_human" />
              </el-form-item>
              <el-form-item label="Lua内存" prop="">
                <el-input v-model="model.used_memory_lua_human" />
              </el-form-item>
              <el-form-item label="客户端数" prop="">
                <el-input v-model="model.connected_clients" />
              </el-form-item>
              <el-form-item label="总连接数" prop="">
                <el-input v-model="model.total_connections_received" />
              </el-form-item>
              <el-form-item label="总命令数" prop="">
                <el-input v-model="model.total_commands_processed" />
              </el-form-item>
              <el-form-item label="DB0" prop="">
                <el-input v-model="model.db0" />
              </el-form-item>
            </div>
            <div v-else-if="model.type === 'memcache'">
              <el-form-item label="memcache" prop="">
                <el-input v-model="model.version" />
              </el-form-item>
              <el-form-item label="运行秒数" prop="">
                <el-input v-model="model.uptime" />
              </el-form-item>
              <el-form-item label="读取字节总数" prop="">
                <el-input v-model="model.bytes_read" />
              </el-form-item>
              <el-form-item label="写入字节总数" prop="">
                <el-input v-model="model.bytes_written" />
              </el-form-item>
              <el-form-item label="分配的内存数" prop="">
                <el-input v-model="model.limit_maxbytes" />
              </el-form-item>
              <el-form-item label="当前打开链接数" prop="">
                <el-input v-model="model.curr_connections" />
              </el-form-item>
              <el-form-item label="曾打开连接总数" prop="">
                <el-input v-model="model.total_connections" />
              </el-form-item>
              <el-form-item label="执行get命令总数" prop="">
                <el-input v-model="model.cmd_get" />
              </el-form-item>
              <el-form-item label="执行set命令总数" prop="">
                <el-input v-model="model.cmd_set" />
              </el-form-item>
              <el-form-item label="flush_all命令总数" prop="">
                <el-input v-model="model.cmd_flush" />
              </el-form-item>
              <el-form-item label="当前服务器时间" prop="">
                <el-input v-model="model.time" />
              </el-form-item>
            </div>
            <div v-else-if="model.type === 'wincache'">
              <el-form-item label="缓存信息" prop="store_config">
                <pre>{{ model.wincache_info }}</pre>
              </el-form-item>
            </div>
            <el-form-item label="">
              <el-button @click="refresh()">刷新</el-button>
              <el-button type="primary" title="清空缓存" @click="submit()">清空</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { info, cache } from '@/api/admin-setting'

export default {
  name: 'Cache',
  components: {},
  data() {
    return {
      height: 680,
      loading: false,
      model: {},
      rules: {}
    }
  },
  created() {
    this.height = screenHeight()
    this.info()
  },
  methods: {
    // 信息
    info() {
      info().then(res => {
        this.model = res.data.cache
      })
    },
    // 清空
    submit() {
      this.loading = true
      cache().then(res => {
        this.info()
        this.loading = false
        this.$message.success(res.data.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      info().then(res => {
        this.model = res.data.cache
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
