<template>
  <div>
    <el-row :gutter="8">
      <el-col :sm="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>服务器信息</span>
          </div>
          <div class="text item">
            <el-form :model="model" label-width="150px">
              <el-form-item label="OS">
                <el-input v-model="model.system_info" />
              </el-form-item>
              <el-form-item label="Web">
                <el-input v-model="model.server_software" />
              </el-form-item>
              <el-form-item label="MySQL">
                <el-input v-model="model.mysql" />
              </el-form-item>
              <el-form-item label="PHP">
                <el-input v-model="model.php_version" />
              </el-form-item>
              <el-form-item label="Protocol">
                <el-input v-model="model.server_protocol" />
              </el-form-item>
              <el-form-item label="IP">
                <el-input v-model="model.ip" />
              </el-form-item>
              <el-form-item label="Domain">
                <el-input v-model="model.domain" />
              </el-form-item>
              <el-form-item label="Port">
                <el-input v-model="model.port" />
              </el-form-item>
              <el-form-item label="php_sapi_name">
                <el-input v-model="model.php_sapi_name" />
              </el-form-item>
              <el-form-item label="max_execution_time">
                <el-input v-model="model.max_execution_time" />
              </el-form-item>
              <el-form-item label="upload_max_filesize">
                <el-input v-model="model.upload_max_filesize" />
              </el-form-item>
              <el-form-item label="post_max_size">
                <el-input v-model="model.post_max_size" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>缓存信息</span>
          </div>
          <div class="text item">
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
                <el-form-item label="内存碎片比率" prop="">
                  <el-input v-model="model.mem_fragmentation_ratio" />
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
                <el-form-item label="缓存信息" prop="wincache_info">
                  <pre>{{ model.wincache_info }}</pre>
                </el-form-item>
              </div>
              <el-form-item label="">
                <el-button :loading="loading" size="mini" title="刷新" @click="refresh()"><i class="el-icon-refresh" /></el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { server } from '@/api/admin/utils'

export default {
  name: 'Server',
  data() {
    return {
      loading: false,
      model: {}
    }
  },
  created() {
    this.server()
  },
  methods: {
    server() {
      server().then(res => {
        this.model = res.data
      })
    },
    refresh() {
      this.loading = true
      server().then(res => {
        this.loading = false
        this.model = res.data
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
</style>
