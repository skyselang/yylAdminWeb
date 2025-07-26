<template>
  <div class="app-container">
    <el-row v-loading="loading">
      <el-col>
        <el-text size="default">{{ $t('密码：') }} {{ model.apidoc_pwd }}</el-text>
        <Clipboard :content="model.apidoc_pwd" :text="true" color="#409EFF" :title="$t('复制密码')" />
        <el-text size="default">Token：{{ model.token_sub }}</el-text>
        <Clipboard :content="model.token" :text="true" color="#409EFF" :title="$t('复制Token')" />
        <el-button text type="primary" :title="$t('刷新')" @click="refresh">
          <Icon icon="Refresh" :size="18" />
        </el-button>
        <el-link type="primary" :href="model.apidoc_url" underline="never" target="_blank" :title="$t('新标签页打开')">
          <Icon icon="Position" :size="18" />
        </el-link>
      </el-col>
      <el-col>
        <iframe :src="model.apidoc_url" frameborder="0" width="100%" :height="height"></iframe>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { screenHeight } from '@/utils/index'
import { apidocApi as infoApi } from '@/api/system/apidoc'
import { tokenValue } from '@/utils/index'

export default {
  name: 'SystemApidoc',
  components: {},
  data() {
    return {
      name: '接口文档',
      height: 680,
      loading: false,
      model: {
        apidoc_url: '',
        apidoc_pwd: '',
        token: '',
        token_sub: ''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.height = screenHeight(200)
      this.info()
    },
    // 信息
    info(ismsg = false) {
      this.loading = true
      infoApi()
        .then((res) => {
          this.model.apidoc_url = res.data.apidoc_url
          this.model.apidoc_pwd = res.data.apidoc_pwd
          this.model.token = tokenValue()
          this.model.token_sub = this.model.token.substring(0, 16) + '...'
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
