<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane
        v-if="checkPermission(['admin/system.Setting/systemInfo'])"
        label="系统设置"
        lazy
      >
        <SettingSystems />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['admin/system.Setting/captchaInfo'])"
        label="验证码设置"
        lazy
      >
        <SettingCaptchas />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/system.Setting/cacheInfo'])" label="缓存设置" lazy>
        <SettingCaches />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['admin/system.Setting/tokenInfo'])"
        label="Token设置"
        lazy
      >
        <SettingTokens />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/system.Setting/logInfo'])" label="日志设置" lazy>
        <SettingLogs />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/system.Setting/apiInfo'])" label="接口设置" lazy>
        <SettingApis />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/system.Setting/emailInfo'])" label="邮件设置" lazy>
        <SettingEmails />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['admin/system.Setting/serverInfo'])"
        label="服务器信息"
        lazy
      >
        <SettingServers />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import SettingApis from './components/SettingApis.vue'
import SettingCaches from './components/SettingCaches.vue'
import SettingCaptchas from './components/SettingCaptchas.vue'
import SettingEmails from './components/SettingEmails.vue'
import SettingLogs from './components/SettingLogs.vue'
import SettingServers from './components/SettingServers.vue'
import SettingSystems from './components/SettingSystems.vue'
import SettingTokens from './components/SettingTokens.vue'

export default {
  name: 'SystemSetting',
  components: {
    SettingApis,
    SettingCaches,
    SettingCaptchas,
    SettingEmails,
    SettingLogs,
    SettingServers,
    SettingSystems,
    SettingTokens
  },
  data() {
    return {
      name: '系统设置'
    }
  },
  methods: {
    checkPermission
  }
}
</script>
