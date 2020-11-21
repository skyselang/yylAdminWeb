<template>
  <div class="app-container">
    <el-row v-loading="serverInfoLoad" :gutter="8">
      <el-col :xs="24" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Environment</span>
            <el-button icon="el-icon-refresh" style="float: right; padding: 2px" @click="serverInfoRefresh()" />
          </div>
          <div class="text item">
            <el-form ref="serverInfoRef" :rules="serverInfoRules" :model="serverInfoModel" label-width="120px">
              <el-form-item label="OS">
                <el-input v-model="serverInfoModel.system_info" />
              </el-form-item>
              <el-form-item label="Web">
                <el-input v-model="serverInfoModel.server_software" />
              </el-form-item>
              <el-form-item label="MySQL">
                <el-input v-model="serverInfoModel.mysql" />
              </el-form-item>
              <el-form-item label="PHP">
                <el-input v-model="serverInfoModel.php_version" />
              </el-form-item>
              <el-form-item label="php_sapi_name">
                <el-input v-model="serverInfoModel.php_sapi_name" />
              </el-form-item>
              <el-form-item label="ThinkPHP">
                <el-input v-model="serverInfoModel.thinkphp" />
              </el-form-item>
              <el-form-item label="Redis">
                <el-input v-model="serverInfoModel.redis" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Server</span>
            <el-button icon="el-icon-refresh" style="float: right; padding: 2px" @click="serverInfoRefresh()" />
          </div>
          <div class="text item">
            <el-form ref="serverInfoRef" :rules="serverInfoRules" :model="serverInfoModel" label-width="150px">
              <el-form-item label="IP">
                <el-input v-model="serverInfoModel.ip" />
              </el-form-item>
              <el-form-item label="Domain">
                <el-input v-model="serverInfoModel.domain" />
              </el-form-item>
              <el-form-item label="Port">
                <el-input v-model="serverInfoModel.port" />
              </el-form-item>
              <el-form-item label="Protocol">
                <el-input v-model="serverInfoModel.server_protocol" />
              </el-form-item>
              <el-form-item label="max_execution_time">
                <el-input v-model="serverInfoModel.max_execution_time" />
              </el-form-item>
              <el-form-item label="upload_max_filesize">
                <el-input v-model="serverInfoModel.upload_max_filesize" />
              </el-form-item>
              <el-form-item label="post_max_size">
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
      this.serverInfoGet()
    },
    serverInfoGet() {
      serverInfo().then(res => {
        this.serverInfoModel = res.data
        this.serverInfoLoad = false
      }).catch(() => {
        this.serverInfoLoad = false
      })
    }
  }
}
</script>

<style scoped>
.item {
  height: 390px;
}
</style>
