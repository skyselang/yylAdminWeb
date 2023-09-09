<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/member.Setting/memberInfo'])" label="会员设置" lazy>
        <setting-member />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/member.Setting/logregInfo'])" label="登录注册设置" lazy>
        <setting-logreg />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/member.Setting/thirdInfo'])" label="第三方账号设置" lazy>
        <setting-third />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/member.Setting/captchaInfo'])" label="验证码设置" lazy>
        <setting-captcha />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/member.Setting/tokenInfo'])" label="Token设置" lazy>
        <setting-token />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/member.Setting/logInfo'])" label="日志设置" lazy>
        <setting-log />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/member.Setting/apiInfo'])" label="接口设置" lazy>
        <setting-api />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import SettingApi from './components/SettingApi'
import SettingCaptcha from './components/SettingCaptcha'
import SettingLog from './components/SettingLog'
import SettingLogreg from './components/SettingLogreg'
import SettingMember from './components/SettingMember'
import SettingThird from './components/SettingThird'
import SettingToken from './components/SettingToken'

export default {
  name: 'MemberSetting',
  components: { SettingApi, SettingCaptcha, SettingLog, SettingLogreg, SettingMember, SettingThird, SettingToken },
  data() {
    return {
      name: '会员设置'
    }
  },
  created() {},
  methods: {
    checkPermission
  }
}
</script>
