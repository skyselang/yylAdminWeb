<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/SettingWechat/offiInfo'])" label="公众号" name="WechatOffi">
        <WechatOffi v-if="WechatOffi" class="dialog-body" :style="{height:height+50+'px'}" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/SettingWechat/miniInfo'])" label="小程序" name="WechatMini">
        <WechatMini v-if="WechatMini" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import checkPermission from '@/utils/permission' // 权限判断函数
import WechatOffi from './components/WechatOffi'
import WechatMini from './components/WechatMini'

export default {
  name: 'Wechat',
  components: { WechatOffi, WechatMini },
  data() {
    return {
      WechatOffi: true,
      WechatMini: false,
      actTabName: 'WechatOffi'
    }
  },
  created() {
    this.height = screenHeight()
  },
  methods: {
    checkPermission,
    tabClick(tab) {
      this[tab.name] = true
    }
  }
}
</script>
