<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/cacheInfo'])" label="缓存设置" lazy>
        <setting-cache />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/tokenInfo'])" label="Token设置" lazy>
        <setting-token />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/captchaInfo'])" label="验证码设置" lazy>
        <setting-captcha />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/logInfo'])" label="日志设置" lazy>
        <setting-log />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/apiInfo'])" label="接口设置" lazy>
        <setting-api />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Setting/systemInfo'])" label="系统设置" lazy>
        <setting-system />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import SettingCache from './components/SettingCache'
import SettingToken from './components/SettingToken'
import SettingCaptcha from './components/SettingCaptcha'
import SettingLog from './components/SettingLog'
import SettingApi from './components/SettingApi'
import SettingSystem from './components/SettingSystem'

export default {
  name: 'AdminSystemSetting',
  directives: { },
  components: { SettingCache, SettingToken, SettingCaptcha, SettingLog, SettingApi, SettingSystem },
  data() {
    return {}
  },
  created() { },
  methods: {
    checkPermission
  }
}
</script>
