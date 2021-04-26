<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/WechatConfig/offiInfo'])" label="公众号" name="WechatOffi">
        <wechat-offi v-if="WechatOffi" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/WechatConfig/miniInfo'])" label="小程序" name="WechatMini">
        <wechat-mini v-if="WechatMini" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import WechatOffi from './components/WechatOffi'
import WechatMini from './components/WechatMini'

export default {
  name: 'Map',
  components: { WechatOffi, WechatMini },
  data() {
    return {
      WechatOffi: true,
      WechatMini: false,
      actTabName: 'WechatOffi'
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
