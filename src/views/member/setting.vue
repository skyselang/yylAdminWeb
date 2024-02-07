<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane
        v-if="checkPermission(['admin/member.Setting/memberInfo'])"
        label="会员设置"
        lazy
      >
        <SettingMember />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['admin/member.Setting/logregInfo'])"
        label="登录注册设置"
        lazy
      >
        <SettingLogreg />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['admin/member.Setting/thirdInfo'])"
        label="第三方账号设置"
        lazy
      >
        <SettingThird />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['admin/member.Setting/captchaInfo'])"
        label="验证码设置"
        lazy
      >
        <SettingCaptcha />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['admin/member.Setting/tokenInfo'])"
        label="Token设置"
        lazy
      >
        <SettingToken />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/member.Setting/logInfo'])" label="日志设置" lazy>
        <SettingLog />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/member.Setting/apiInfo'])" label="接口设置" lazy>
        <SettingApi />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import SettingApi from './components/SettingApi.vue'
import SettingCaptcha from './components/SettingCaptcha.vue'
import SettingLog from './components/SettingLog.vue'
import SettingLogreg from './components/SettingLogreg.vue'
import SettingMember from './components/SettingMember.vue'
import SettingThird from './components/SettingThird.vue'
import SettingToken from './components/SettingToken.vue'

export default {
  name: 'MemberSetting',
  components: {
    SettingApi,
    SettingCaptcha,
    SettingLog,
    SettingLogreg,
    SettingMember,
    SettingThird,
    SettingToken
  },
  data() {
    return {
      name: '会员设置'
    }
  },
  methods: {
    checkPermission
  }
}
</script>
