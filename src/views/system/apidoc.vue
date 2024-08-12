<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-text size="default">密码：{{ model.apidoc_pwd }}</el-text>
        <el-button text type="primary" title="复制密码" @click="copy(model.apidoc_pwd)">
          <svg-icon icon-class="copy-document" />
        </el-button>

        <el-text size="default">Token：{{ model.token_sub }}</el-text>
        <el-button text type="primary" title="复制Token" @click="copy(model.token)">
          <svg-icon icon-class="copy-document" />
        </el-button>

        <el-button text type="primary" title="刷新" @click="refresh()">
          <svg-icon icon-class="refresh" size="18px" />
        </el-button>
        <el-link
          type="primary"
          :href="model.apidoc_url"
          :underline="false"
          target="_blank"
          title="新标签页打开"
        >
          <svg-icon icon-class="position" size="18px" />
        </el-link>
      </el-col>
      <el-col>
        <iframe :src="model.apidoc_url" frameborder="0" width="100%" :height="height"></iframe>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import clip from '@/utils/clipboard'
import { apidoc } from '@/api/system/apidoc'
import { useUserStoreHook } from '@/store/modules/user'

export default {
  name: 'SystemApidoc',
  data() {
    return {
      name: '接口文档',
      height: 680,
      isload: false,
      model: {
        apidoc_url: '',
        apidoc_pwd: '',
        token: '',
        token_sub: ''
      }
    }
  },
  created() {
    this.height = screenHeight(200)
    if (!this.isload) {
      this.apidoc()
    }
    const userStore = useUserStoreHook()
    this.model.token = userStore.token
    this.model.token_sub = userStore.token.substring(0, 16) + '...'
  },
  methods: {
    // 文档
    apidoc() {
      apidoc().then((res) => {
        this.isload = true
        this.model.apidoc_url = res.data.apidoc_url
        this.model.apidoc_pwd = res.data.apidoc_pwd
      })
    },
    // 刷新
    refresh() {
      this.apidoc()
    },
    // 复制
    copy(text) {
      clip(text)
    }
  }
}
</script>
