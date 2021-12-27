<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/Setting/tokenInfo'])" label="Token设置" lazy>
        <base-token />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/Setting/captchaInfo'])" label="验证码设置" lazy>
        <base-captcha />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/Setting/logInfo'])" label="日志设置" lazy>
        <base-log />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/Setting/apiInfo'])" label="接口设置" lazy>
        <base-api />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import BaseToken from './components/BaseToken'
import BaseCaptcha from './components/BaseCaptcha'
import BaseLog from './components/BaseLog'
import BaseApi from './components/BaseApi'

export default {
  name: 'SettingBase',
  components: { BaseToken, BaseCaptcha, BaseLog, BaseApi },
  data() {
    return {
      name: '基础设置'
    }
  },
  created() {},
  methods: {
    checkPermission
  }
}
</script>
