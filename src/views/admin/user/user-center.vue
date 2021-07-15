<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/admin.UserCenter/info'])" label="我的信息" name="info">
        <user-center-info v-if="info" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.UserCenter/edit'])" label="修改信息" name="edit">
        <user-center-edit v-if="edit" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.UserCenter/pwd'])" label="修改密码" name="pwd">
        <user-center-pwd v-if="pwd" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.UserCenter/log'])" label="我的日志" name="log">
        <user-center-log v-if="log" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.UserCenter/setting'])" label="我的设置" name="setting">
        <user-center-setting v-if="setting" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import UserCenterInfo from './components/UserCenterInfo'
import UserCenterEdit from './components/UserCenterEdit'
import UserCenterPwd from './components/UserCenterPwd'
import UserCenterLog from './components/UserCenterLog'
import UserCenterSetting from './components/UserCenterSetting'

export default {
  name: 'AdminUserCenter',
  components: { UserCenterInfo, UserCenterEdit, UserCenterPwd, UserCenterLog, UserCenterSetting },
  data() {
    return {
      info: true,
      edit: false,
      pwd: false,
      avatar: false,
      log: false,
      setting: false,
      actTabName: 'info'
    }
  },
  methods: {
    checkPermission,
    tabClick(tab) {
      this[tab.name] = true
    }
  }
}
</script>
