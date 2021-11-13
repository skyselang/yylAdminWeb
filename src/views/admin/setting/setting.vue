<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/cacheInfo'])" label="缓存设置" lazy>
        <cache />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/tokenInfo'])" label="Token设置" lazy>
        <token />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/captchaInfo'])" label="验证码设置" lazy>
        <captcha />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/logInfo'])" label="日志设置" lazy>
        <log />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/apiInfo'])" label="接口设置" lazy>
        <api />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/systemInfo'])" label="系统设置" lazy>
        <system />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import Cache from './components/Cache'
import Token from './components/Token'
import Captcha from './components/Captcha'
import Log from './components/Log'
import Api from './components/Api'
import System from './components/System'

export default {
  name: 'AdminSystemSetting',
  directives: { },
  components: { Cache, Token, Captcha, Log, Api, System },
  data() {
    return {}
  },
  created() { },
  methods: {
    checkPermission
  }
}
</script>
