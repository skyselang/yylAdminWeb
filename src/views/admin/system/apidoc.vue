<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <span class="apidoc-item">密码：{{ model.apidoc_pwd }}
          <i class="el-icon-copy-document" title="复制密码" @click="copy(model.apidoc_pwd, $event)" />
        </span>
        <span class="apidoc-item" :title="model.admin_token">Token：{{ model.admin_token_sub }}
          <i class="el-icon-copy-document" title="复制Token" @click="copy(model.admin_token, $event)" />
        </span>
        <el-button class="filter-item" size="mini" circle title="刷新" @click="refresh()"><i class="el-icon-refresh" /></el-button>
        <el-link style="margin-left:10px" :href="model.apidoc_url" target="_blank" :underline="false" title="新标签页打开"><i class="el-icon-position" /></el-link>
      </el-col>
      <el-col>
        <iframe :src="model.apidoc_url" frameborder="0" width="100%" :height="height" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import clip from '@/utils/clipboard'
import { apidoc } from '@/api/admin/apidoc'

export default {
  name: 'SystemApidoc',
  components: {},
  data() {
    return {
      name: '接口文档',
      height: 680,
      isload: false,
      model: {
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
    // 文档
    apidoc() {
      apidoc().then(res => {
        this.isload = true
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.apidoc()
    },
    // 复制
    copy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message.error('复制失败')
      }
    }
  }
}
</script>

<style scoped>
.apidoc-item {
  color: #303133;
  font-size: 14px;
  padding-right: 30px;
}
.el-icon-copy-document {
  color: #1890ff;
}
</style>
