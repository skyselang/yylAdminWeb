<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/AdminMy/myInfo'])" label="我的信息" name="info">
        <my-info v-if="info" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminMy/myEdit'])" label="修改信息" name="edit">
        <my-edit v-if="edit" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminMy/myPwd'])" label="修改密码" name="pwd">
        <my-pwd v-if="pwd" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminMy/myAvatar'])" label="更换头像" name="avatar">
        <my-avatar v-if="avatar" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminMy/myLog'])" label="我的日志" name="log">
        <my-log v-if="log" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminMy/mySetting'])" label="我的设置" name="setting">
        <my-setting v-if="setting" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import MyInfo from './components/info'
import MyEdit from './components/edit'
import MyPwd from './components/pwd'
import MyAvatar from './components/avatar'
import MyLog from './components/log'
import MySetting from './components/setting'

export default {
  name: 'My',
  components: { MyInfo, MyEdit, MyPwd, MyAvatar, MyLog, MySetting },
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
