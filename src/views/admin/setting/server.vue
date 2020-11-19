<template>
  <div class="app-container">
    <el-row v-loading="serverInfoLoad" :gutter="8">
      <el-col :xs="24" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Environment</span>
          </div>
          <div class="text item">
            <el-form ref="serverInfoRef" :rules="serverInfoRules" :model="serverInfoModel" label-width="100px">
              <el-form-item label="OS">
                <el-input v-model="serverInfoModel.system_info" />
              </el-form-item>
              <el-form-item label="Web">
                <el-input v-model="serverInfoModel.server_software" />
              </el-form-item>
              <el-form-item label="PHP">
                <el-input v-model="serverInfoModel.php_info" />
              </el-form-item>
              <el-form-item label="Database">
                <el-input v-model="serverInfoModel.database" />
              </el-form-item>
              <el-form-item label="ThinkPHP">
                <el-input v-model="serverInfoModel.thinkphp" />
              </el-form-item>
              <el-form-item label="Redis">
                <el-input v-model="serverInfoModel.redis" />
              </el-form-item>
              <el-form-item>
                <el-button :loading="serverInfoLoad" @click="serverInfoRefresh()">刷新</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Server</span>
          </div>
          <div class="text item">
            <el-form ref="serverInfoRef" :rules="serverInfoRules" :model="serverInfoModel" label-width="140px">
              <el-form-item label="IP">
                <el-input v-model="serverInfoModel.ip" />
              </el-form-item>
              <el-form-item label="域名">
                <el-input v-model="serverInfoModel.domain" />
              </el-form-item>
              <el-form-item label="端口">
                <el-input v-model="serverInfoModel.port" />
              </el-form-item>
              <el-form-item label="协议/版本">
                <el-input v-model="serverInfoModel.server_protocol" />
              </el-form-item>
              <el-form-item label="脚本最大执行时间">
                <el-input v-model="serverInfoModel.max_execution_time" />
              </el-form-item>
              <el-form-item label="上传文件最大尺寸">
                <el-input v-model="serverInfoModel.upload_max_filesize" />
              </el-form-item>
              <el-form-item label="POST数据最大尺寸">
                <el-input v-model="serverInfoModel.post_max_size" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { serverInfo } from '@/api/admin'

export default {
  name: 'ServerInfo',
  components: {},
  data() {
    return {
      serverInfoLoad: false,
      serverInfoModel: {},
      serverInfoRules: {}
    }
  },
  created() {
    this.serverInfoGet()
  },
  methods: {
    serverInfoRefresh() {
      this.serverInfoLoad = true
      serverInfo('', 'post')
        .then(res => {
          this.serverInfoLoad = false
          this.serverInfoModel = res.data
          this.$message({ message: res.msg, type: 'success' })
        })
        .catch(() => {
          this.serverInfoLoad = false
        })
    },
    serverInfoGet() {
      serverInfo().then(res => {
        this.serverInfoModel = res.data
      })
    }
  }
}
</script>

<style scoped>
.item {
  height: 410px;
}
</style>
