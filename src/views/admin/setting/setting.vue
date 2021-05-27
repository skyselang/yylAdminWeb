<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/cacheInfo'])" label="缓存设置" name="cache">
        <Cache v-if="cache" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/tokenInfo'])" label="Token设置" name="token">
        <Token v-if="token" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/captchaInfo'])" label="验证码设置" name="captcha">
        <Captcha v-if="captcha" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/logInfo'])" label="日志设置" name="log">
        <Log v-if="log" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/apiInfo'])" label="接口设置" name="api">
        <Api v-if="api" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import permission from '@/directive/permission/index.js' // 权限判断指令
import Cache from './components/Cache'
import Token from './components/Token'
import Captcha from './components/Captcha'
import Log from './components/Log'
import Api from './components/Api'

export default {
  name: 'Setting',
  directives: { permission },
  components: { Cache, Token, Captcha, Log, Api },
  data() {
    return {
      cache: true,
      token: false,
      captcha: false,
      log: false,
      api: false,
      actTabName: 'cache'
    }
  },
  created() { },
  methods: {
    checkPermission,
    tabClick(tab) {
      this[tab.name] = true
    }
  }
}
</script>
