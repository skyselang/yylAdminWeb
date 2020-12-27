<template>
  <div class="app-container">
    <el-card v-loading="serverLoad" class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form ref="serverInfoRef" :model="serverModel" :rules="serverRules" label-width="150px">
            <el-form-item label="OS">
              <el-input v-model="serverModel.system_info" />
            </el-form-item>
            <el-form-item label="Web">
              <el-input v-model="serverModel.server_software" />
            </el-form-item>
            <el-form-item label="MySQL">
              <el-input v-model="serverModel.mysql" />
            </el-form-item>
            <el-form-item label="PHP">
              <el-input v-model="serverModel.php_version" />
            </el-form-item>
            <el-form-item label="php_sapi_name">
              <el-input v-model="serverModel.php_sapi_name" />
            </el-form-item>
            <el-form-item label="ThinkPHP">
              <el-input v-model="serverModel.thinkphp" />
            </el-form-item>
            <el-form-item label="Redis">
              <el-input v-model="serverModel.redis" />
            </el-form-item>
            <el-form-item label="IP">
              <el-input v-model="serverModel.ip" />
            </el-form-item>
            <el-form-item label="Domain">
              <el-input v-model="serverModel.domain" />
            </el-form-item>
            <el-form-item label="Port">
              <el-input v-model="serverModel.port" />
            </el-form-item>
            <el-form-item label="Protocol">
              <el-input v-model="serverModel.server_protocol" />
            </el-form-item>
            <el-form-item label="max_execution_time">
              <el-input v-model="serverModel.max_execution_time" />
            </el-form-item>
            <el-form-item label="upload_max_filesize">
              <el-input v-model="serverModel.upload_max_filesize" />
            </el-form-item>
            <el-form-item label="post_max_size">
              <el-input v-model="serverModel.post_max_size" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { serverInfo } from '@/api/admin'

export default {
  name: 'ServerInfo',
  components: {},
  data() {
    return {
      serverLoad: false,
      serverModel: {},
      serverRules: {}
    }
  },
  created() {
    this.serverGet()
  },
  methods: {
    serverGet() {
      serverInfo().then(res => {
        this.serverModel = res.data
      })
    },
    serverRefresh() {
      this.serverLoad = true
      serverInfo().then(res => {
        this.serverModel = res.data
        this.serverLoad = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.serverLoad = false
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
