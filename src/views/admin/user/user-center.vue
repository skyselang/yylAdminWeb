<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/admin.UserCenter/info'])" label="我的信息" lazy>
        <user-center-info />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.UserCenter/edit'])" label="修改信息" lazy>
        <user-center-edit />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.UserCenter/pwd'])" label="修改密码" lazy>
        <user-center-pwd />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.UserCenter/log'])" label="我的日志" lazy>
        <user-center-log />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.UserCenter/setting'])" label="我的设置" lazy>
        <user-center-setting />
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
      name: '个人中心'
    }
  },
  methods: {
    checkPermission
  }
}
</script>
