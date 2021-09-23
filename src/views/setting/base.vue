<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/Setting/tokenInfo'])" label="Token设置" lazy>
        <token />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/Setting/captchaInfo'])" label="验证码设置" lazy>
        <captcha />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/Setting/logInfo'])" label="日志设置" lazy>
        <log />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/Setting/apiInfo'])" label="接口设置" lazy>
        <api />
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
      height: 600
    }
  },
  created() {

  },
  methods: {
    checkPermission
  }
}
</script>
