<template>
  <div class="app-container">
    <el-card v-loading="cacheLoad" class="box-card" :style="{height:height+130+'px', overflow:'auto'}">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form ref="cacheRef" :model="cacheModel" :rules="cacheRules" label-width="130px">
            <el-form-item label="缓存类型" prop="type">
              <el-input v-model="cacheModel.type" />
            </el-form-item>
            <div v-if="cacheModel.type === 'redis'">
              <el-form-item label="Redis" prop="">
                <el-input v-model="cacheModel.redis_version" />
              </el-form-item>
              <el-form-item label="运行时长" prop="">
                <el-input v-model="cacheModel.uptime_in_days" />
              </el-form-item>
              <el-form-item label="已用内存" prop="">
                <el-input v-model="cacheModel.used_memory_human" />
              </el-form-item>
              <el-form-item label="峰值内存" prop="">
                <el-input v-model="cacheModel.used_memory_peak_human" />
              </el-form-item>
              <el-form-item label="Lua内存" prop="">
                <el-input v-model="cacheModel.used_memory_lua_human" />
              </el-form-item>
              <el-form-item label="客户端数" prop="">
                <el-input v-model="cacheModel.connected_clients" />
              </el-form-item>
              <el-form-item label="总连接数" prop="">
                <el-input v-model="cacheModel.total_connections_received" />
              </el-form-item>
              <el-form-item label="总命令数" prop="">
                <el-input v-model="cacheModel.total_commands_processed" />
              </el-form-item>
              <el-form-item label="DB0" prop="">
                <el-input v-model="cacheModel.db0" />
              </el-form-item>
            </div>
            <div v-else-if="cacheModel.type === 'memcache'">
              <el-form-item label="memcache" prop="">
                <el-input v-model="cacheModel.version" />
              </el-form-item>
              <el-form-item label="运行秒数" prop="">
                <el-input v-model="cacheModel.uptime" />
              </el-form-item>
              <el-form-item label="读取字节总数" prop="">
                <el-input v-model="cacheModel.bytes_read" />
              </el-form-item>
              <el-form-item label="写入字节总数" prop="">
                <el-input v-model="cacheModel.bytes_written" />
              </el-form-item>
              <el-form-item label="分配的内存数" prop="">
                <el-input v-model="cacheModel.limit_maxbytes" />
              </el-form-item>
              <el-form-item label="当前打开链接数" prop="">
                <el-input v-model="cacheModel.curr_connections" />
              </el-form-item>
              <el-form-item label="曾打开连接总数" prop="">
                <el-input v-model="cacheModel.total_connections" />
              </el-form-item>
              <el-form-item label="执行get命令总数" prop="">
                <el-input v-model="cacheModel.cmd_get" />
              </el-form-item>
              <el-form-item label="执行set命令总数" prop="">
                <el-input v-model="cacheModel.cmd_set" />
              </el-form-item>
              <el-form-item label="flush_all命令总数" prop="">
                <el-input v-model="cacheModel.cmd_flush" />
              </el-form-item>
              <el-form-item label="当前服务器时间" prop="">
                <el-input v-model="cacheModel.time" />
              </el-form-item>
            </div>
            <div v-else-if="cacheModel.type === 'wincache'">
              <el-form-item label="缓存信息" prop="store_config">
                <pre>{{ cacheModel.wincache_info }}</pre>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form ref="cacheRef" :model="cacheModel" :rules="cacheRules" label-width="130px">
            <el-form-item label="缓存读取次数" prop="read_times">
              <el-input v-model="cacheModel.read_times" />
            </el-form-item>
            <el-form-item label="缓存写入次数" prop="write_times">
              <el-input v-model="cacheModel.write_times" />
            </el-form-item>
            <el-form-item label="缓存配置" prop="store_config">
              <pre>{{ cacheModel.store_config }}</pre>
            </el-form-item>
            <el-form-item label="">
              <el-button title="刷新信息" @click="cacheRefresh()">刷新</el-button>
              <el-button type="primary" title="清空缓存" @click="cacheClear()">清空</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { settingCache } from '@/api/admin'

export default {
  name: 'SettingCache',
  components: {},
  data() {
    return {
      height: 680,
      cacheLoad: false,
      cacheModel: {},
      cacheRules: {}
    }
  },
  created() {
    this.height = screenHeight()
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
      settingCache().then(res => {
        this.cacheModel = res.data
        this.cacheLoad = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.cacheLoad = false
      })
    },
    // 清空
    cacheClear() {
      this.cacheLoad = true
      settingCache({}, 'post').then(res => {
        this.cacheGet()
        this.cacheLoad = false
        this.$message.success(res.data.msg)
      }).catch(() => {
        this.cacheLoad = false
      })
    }
  }
}
</script>
