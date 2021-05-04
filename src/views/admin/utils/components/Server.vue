<template>
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
</template>

<script>
import { server } from '@/api/admin-utils'

export default {
  name: 'Server',
  components: {},
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
    }
  }
}
</script>

<style scoped>
</style>
