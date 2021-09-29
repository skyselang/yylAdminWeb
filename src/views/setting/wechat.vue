<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/SettingWechat/offiInfo'])" label="公众号" lazy>
        <wechat-offi class="dialog-body" :style="{height:height+50+'px'}" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/SettingWechat/miniInfo'])" label="小程序" lazy>
        <wechat-mini />
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
  name: 'SettingWechat',
  components: { WechatOffi, WechatMini },
  data() {
    return {
      height: 680
    }
  },
  created() {
    this.height = screenHeight()
  },
  methods: {
    checkPermission
  }
}
</script>
