<template>
  <el-scrollbar native :height="height">
    <el-row>
      <el-col :span="12">
        <el-form :model="model" label-width="150px">
          <el-form-item label="ThinkPHP">
            <el-input v-model="model.thinkphp" />
          </el-form-item>
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
          <el-form-item label="post_max_size" class="ya-margin-bottom">
            <el-input v-model="model.post_max_size" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form :model="model" label-width="150px">
          <el-form-item label="缓存类型" prop="type">
            <el-input v-model="model.cache_type" />
          </el-form-item>
          <div v-if="model.cache_type === 'redis'">
            <el-form-item label="Redis">
              <el-input v-model="model.redis_version" />
            </el-form-item>
            <el-form-item label="运行时长">
              <el-input v-model="model.uptime_in_days" />
            </el-form-item>
            <el-form-item label="已用内存">
              <el-input v-model="model.used_memory_human" />
            </el-form-item>
            <el-form-item label="峰值内存">
              <el-input v-model="model.used_memory_peak_human" />
            </el-form-item>
            <el-form-item label="Lua内存">
              <el-input v-model="model.used_memory_lua_human" />
            </el-form-item>
            <el-form-item label="客户端数">
              <el-input v-model="model.connected_clients" />
            </el-form-item>
            <el-form-item label="总连接数">
              <el-input v-model="model.total_connections_received" />
            </el-form-item>
            <el-form-item label="总命令数">
              <el-input v-model="model.total_commands_processed" />
            </el-form-item>
            <el-form-item label="内存碎片比率">
              <el-input v-model="model.mem_fragmentation_ratio" />
            </el-form-item>
            <el-form-item label="DB0" class="ya-margin-bottom">
              <el-input v-model="model.db0" />
            </el-form-item>
            <template v-for="n in 15">
              <el-form-item
                v-if="model['db' + n]"
                :key="n"
                :label="'DB' + n"
                class="ya-margin-bottom"
              >
                <el-input v-model="model['db' + n]" />
              </el-form-item>
            </template>
          </div>
          <div v-else-if="model.cache_type === 'memcache'">
            <el-form-item label="memcache">
              <el-input v-model="model.version" />
            </el-form-item>
            <el-form-item label="运行秒数">
              <el-input v-model="model.uptime" />
            </el-form-item>
            <el-form-item label="读取字节总数">
              <el-input v-model="model.bytes_read" />
            </el-form-item>
            <el-form-item label="写入字节总数">
              <el-input v-model="model.bytes_written" />
            </el-form-item>
            <el-form-item label="分配的内存数">
              <el-input v-model="model.limit_maxbytes" />
            </el-form-item>
            <el-form-item label="当前打开链接数">
              <el-input v-model="model.curr_connections" />
            </el-form-item>
            <el-form-item label="曾打开连接总数">
              <el-input v-model="model.total_connections" />
            </el-form-item>
            <el-form-item label="执行get命令总数">
              <el-input v-model="model.cmd_get" />
            </el-form-item>
            <el-form-item label="执行set命令总数">
              <el-input v-model="model.cmd_set" />
            </el-form-item>
            <el-form-item label="flush_all命令总数">
              <el-input v-model="model.cmd_flush" />
            </el-form-item>
            <el-form-item label="当前服务器时间" class="ya-margin-bottom">
              <el-input v-model="model.time" />
            </el-form-item>
          </div>
          <div v-else-if="model.cache_type === 'wincache'">
            <el-form-item label="缓存信息" prop="wincache_info">
              <pre>{{ model.wincache_info }}</pre>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-form :model="model" label-width="150px">
          <el-form-item>
            <el-button :loading="loading" title="刷新" @click="refresh()">刷新</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { serverInfo } from '@/api/system/setting'

export default {
  name: 'SystemSettingServer',
  data() {
    return {
      name: '服务器信息',
      height: 680,
      loading: false,
      model: {}
    }
  },
  created() {
    this.height = screenHeight(210)
    this.info()
  },
  methods: {
    // 信息
    info() {
      serverInfo().then((res) => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      serverInfo({ force: 1 })
        .then((res) => {
          this.model = res.data
          this.loading = false
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
