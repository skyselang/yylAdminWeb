<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/Setting/tokenInfo'])" label="Token设置" name="token">
        <Token v-if="token" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/Setting/captchaInfo'])" label="验证码设置" name="captcha">
        <Captcha v-if="captcha" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/Setting/logInfo'])" label="日志设置" name="log">
        <Log v-if="log" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/Setting/apiInfo'])" label="接口设置" name="api">
        <Api v-if="api" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import Token from './components/Token'
import Captcha from './components/Captcha'
import Log from './components/Log'
import Api from './components/Api'

export default {
  name: 'Base',
  components: { Token, Captcha, Log, Api },
  data() {
    return {
      height: 600,
      token: true,
      captcha: false,
      log: false,
      api: false,
      actTabName: 'token'
    }
  },
  created() {

  },
  methods: {
    checkPermission,
    tabClick(tab) {
      this[tab.name] = true
    }
  }
}
</script>
