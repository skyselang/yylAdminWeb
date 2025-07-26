<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :span="12">
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
          <el-form-item label="post_max_size">
            <el-input v-model="model.post_max_size" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('缓存类型')" prop="type">
            <el-input v-model="model.cache_type" />
          </el-form-item>
          <div v-if="model.cache_type === 'redis'">
            <el-form-item label="Redis">
              <el-input v-model="model.redis_version" />
            </el-form-item>
            <el-form-item :label="$t('运行时长')">
              <el-input v-model="model.uptime_in_days" />
            </el-form-item>
            <el-form-item :label="$t('已用内存')">
              <el-input v-model="model.used_memory_human" />
            </el-form-item>
            <el-form-item :label="$t('峰值内存')">
              <el-input v-model="model.used_memory_peak_human" />
            </el-form-item>
            <el-form-item :label="$t('Lua内存')">
              <el-input v-model="model.used_memory_lua_human" />
            </el-form-item>
            <el-form-item :label="$t('客户端数')">
              <el-input v-model="model.connected_clients" />
            </el-form-item>
            <el-form-item :label="$t('总连接数')">
              <el-input v-model="model.total_connections_received" />
            </el-form-item>
            <el-form-item :label="$t('总命令数')">
              <el-input v-model="model.total_commands_processed" />
            </el-form-item>
            <el-form-item :label="$t('内存碎片比率')">
              <el-input v-model="model.mem_fragmentation_ratio" />
            </el-form-item>
            <el-form-item label="DB0">
              <el-input v-model="model.db0" />
            </el-form-item>
            <template v-for="n in 15">
              <el-form-item v-if="model['db' + n]" :key="n" :label="'DB' + n">
                <el-input v-model="model['db' + n]" />
              </el-form-item>
            </template>
          </div>
          <div v-else-if="model.cache_type === 'memcache'">
            <el-form-item label="memcache">
              <el-input v-model="model.version" />
            </el-form-item>
            <el-form-item :label="$t('运行秒数')">
              <el-input v-model="model.uptime" />
            </el-form-item>
            <el-form-item :label="$t('读取字节总数')">
              <el-input v-model="model.bytes_read" />
            </el-form-item>
            <el-form-item :label="$t('写入字节总数')">
              <el-input v-model="model.bytes_written" />
            </el-form-item>
            <el-form-item :label="$t('分配的内存数')">
              <el-input v-model="model.limit_maxbytes" />
            </el-form-item>
            <el-form-item :label="$t('当前打开链接数')">
              <el-input v-model="model.curr_connections" />
            </el-form-item>
            <el-form-item :label="$t('曾打开连接总数')">
              <el-input v-model="model.total_connections" />
            </el-form-item>
            <el-form-item :label="$t('执行get命令总数')">
              <el-input v-model="model.cmd_get" />
            </el-form-item>
            <el-form-item :label="$t('执行set命令总数')">
              <el-input v-model="model.cmd_set" />
            </el-form-item>
            <el-form-item :label="$t('flush_all命令总数')">
              <el-input v-model="model.cmd_flush" />
            </el-form-item>
            <el-form-item :label="$t('当前服务器时间')">
              <el-input v-model="model.time" />
            </el-form-item>
          </div>
          <div v-else-if="model.cache_type === 'wincache'">
            <el-form-item :label="$t('缓存信息')" prop="wincache_info">
              <pre>{{ model.wincache_info }}</pre>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-form-item>
      <el-button :loading="loading" :title="$t('刷新')" @click="refresh">{{ $t('刷新') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight } from '@/utils/index'
import { serverInfoApi as infoApi } from '@/api/system/setting'

export default {
  data() {
    return {
      name: '服务器信息',
      height: 680,
      loading: false,
      model: {},
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(270)
    this.info()
  },
  methods: {
    // 信息
    info(ismsg = false) {
      if (ismsg) {
        this.loading = true
      }
      infoApi({ force: ismsg })
        .then((res) => {
          this.model = res.data
          this.loading = false
          if (ismsg) {
            ElMessage.success(res.msg)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 刷新
    refresh() {
      this.info(true)
    }
  }
}
</script>
