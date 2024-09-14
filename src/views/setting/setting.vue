<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/setting.Setting/info'])" label="基本信息" lazy>
        <SettingBase />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/setting.Setting/info'])" label="联系信息" lazy>
        <SettingContact />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['admin/setting.Setting/emailInfo'])"
        label="邮件设置"
        lazy
      >
        <SettingEmail />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['admin/setting.Setting/emailTest'])"
        label="邮件测试"
        lazy
      >
        <SettingEmailTest />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import SettingBase from './components/SettingBase.vue'
import SettingContact from './components/SettingContact.vue'
import SettingEmail from './components/SettingEmail.vue'
import SettingEmailTest from './components/SettingEmailTest.vue'

export default {
  name: 'SettingSetting',
  components: {
    SettingBase,
    SettingContact,
    SettingEmail,
    SettingEmailTest
  },
  data() {
    return {
      name: '设置管理'
    }
  },
  methods: {
    checkPermission
  }
}
</script>
