<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/cacheInfo'])" label="缓存设置" lazy>
        <Cache />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/tokenInfo'])" label="Token设置" lazy>
        <Token />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/captchaInfo'])" label="验证码设置" lazy>
        <Captcha />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/logInfo'])" label="日志设置" lazy>
        <Log />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/apiInfo'])" label="接口设置" lazy>
        <Api />
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
    return {}
  },
  created() { },
  methods: {
    checkPermission
  }
}
</script>
