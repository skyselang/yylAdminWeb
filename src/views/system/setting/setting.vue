<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="hasPerm(['admin/system.Setting/systemInfo'])" :label="$t('系统设置')" lazy>
        <System />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.Setting/captchaInfo'])" :label="$t('验证码设置')" lazy>
        <Captcha />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.Setting/emailInfo'])" :label="$t('邮件设置')" lazy>
        <Email />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.Setting/logInfo'])" :label="$t('日志设置')" lazy>
        <Log />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.Setting/cacheInfo'])" :label="$t('缓存设置')" lazy>
        <Cache />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.Setting/apiInfo'])" :label="$t('接口设置')" lazy>
        <Api />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.Setting/tokenInfo'])" :label="$t('Token设置')" lazy>
        <Token />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.Setting/loginMsgInfo'])" :label="$t('登录页提示')" lazy>
        <LoginMsg />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['admin/system.Setting/serverInfo'])" :label="$t('服务器信息')" lazy>
        <Server />
      </el-tab-pane>
      <el-tab-pane v-if="develop" :label="$t('开发工具')" lazy>
        <Develop />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { hasPerm } from '@/utils/index'
import Api from './component/Api.vue'
import Cache from './component/Cache.vue'
import Captcha from './component/Captcha.vue'
import Email from './component/Email.vue'
import Log from './component/Log.vue'
import Server from './component/Server.vue'
import System from './component/System.vue'
import Token from './component/Token.vue'
import LoginMsg from './component/LoginMsg.vue'
import Develop from './component/Develop.vue'

export default {
  name: 'SystemSetting',
  components: { Api, Cache, Captcha, Email, Log, Server, System, Token, LoginMsg, Develop },
  data() {
    return {
      name: '系统设置',
      develop: false
    }
  },
  created() {
    if (process.env.NODE_ENV === 'development') {
      this.develop = true
    }
  },
  methods: {
    hasPerm
  }
}
</script>
