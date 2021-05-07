<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/cacheInfo'])" label="缓存设置" name="cache">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <Cache v-if="cache" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/tokenInfo'])" label="Token设置" name="token">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <Token v-if="token" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminSetting/verifyInfo'])" label="验证码设置" name="verify">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <Verify v-if="verify" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import permission from '@/directive/permission/index.js' // 权限判断指令
import Cache from './components/Cache'
import Token from './components/Token'
import Verify from './components/Verify'

export default {
  name: 'Setting',
  directives: { permission },
  components: { Cache, Token, Verify },
  data() {
    return {
      cache: true,
      token: false,
      verify: false,
      actTabName: 'cache'
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
