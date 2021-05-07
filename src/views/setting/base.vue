<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/Setting/tokenInfo'])" label="Token设置" name="token">
        <token v-if="token" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/Setting/verifyInfo'])" label="验证码设置" name="verify">
        <verify v-if="verify" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import Token from './components/Token'
import Verify from './components/Verify'

export default {
  name: 'Base',
  components: { Token, Verify },
  data() {
    return {
      token: true,
      verify: false,
      actTabName: 'token'
    }
  },
  created() { },
  methods: {
    checkPermission,
    tabClick(tab) {
      this[tab.name] = true
    }
  }
}
</script>
