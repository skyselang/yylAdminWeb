<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/setting.Setting/captchaInfo'])" label="验证码设置" lazy>
        <setting-captcha />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/setting.Setting/tokenInfo'])" label="Token设置" lazy>
        <setting-token />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/setting.Setting/logInfo'])" label="日志设置" lazy>
        <setting-log />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/setting.Setting/apiInfo'])" label="接口设置" lazy>
        <setting-api />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/setting.Setting/diyInfo'])" label="自定义设置" lazy>
        <setting-diy />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import SettingToken from './components/SettingToken'
import SettingCaptcha from './components/SettingCaptcha'
import SettingLog from './components/SettingLog'
import SettingApi from './components/SettingApi'
import SettingDiy from './components/SettingDiy'

export default {
  name: 'SettingSetting',
  components: { SettingToken, SettingCaptcha, SettingLog, SettingApi, SettingDiy },
  data() {
    return {
      name: '设置管理'
    }
  },
  created() {},
  methods: {
    checkPermission
  }
}
</script>
