<template>
  <div class="app-container">
    <el-row :gutter="0">
      <el-col :span="24">
        <span class="padding-right">密码：{{ apidocModel.apidoc_pwd }}
          <i class="el-icon-copy-document" title="复制密码" @click="apidocCopy(apidocModel.apidoc_pwd, $event)" />
        </span>
        <span class="padding-right">AdminToken：{{ apidocModel.admin_token_sub }}
          <i class="el-icon-copy-document" title="复制Token" @click="apidocCopy(apidocModel.admin_token, $event)" />
        </span>
        <el-button class="filter-item" size="mini" @click="refresh()"><i class="el-icon-refresh" />刷新</el-button>
      </el-col>
      <el-col :span="24">
        <iframe :src="apidocModel.apidoc_url" frameborder="0" width="100%" :height="height" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import clip from '@/utils/clipboard'
import { apidoc } from '@/api/admin-apidoc'

export default {
  name: 'Apidoc',
  components: {},
  data() {
    return {
      height: 600,
      isload: false,
      apidocModel: {
        apidoc_url: '',
        apidoc_pwd: '',
        admin_token: '',
        admin_token_sub: ''
      }
    }
  },
  created() {
    this.height = screenHeight(160)
    if (!this.isload) {
      this.apidoc()
    }
  },
  methods: {
    apidoc() {
      apidoc().then(res => {
        this.isload = true
        this.apidocModel = res.data
      })
    },
    // 刷新
    refresh() {
      this.apidoc()
    },
    apidocCopy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message({ message: '复制失败', type: 'error' })
      }
    }
  }
}
</script>

<style scoped>
.padding-right {
  color: #303133;
  font-size: 14px;
  padding-right: 30px;
}
.el-icon-copy-document {
  color: #1890ff;
}
</style>
