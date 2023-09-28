<template>
  <div>
    <el-card class="dialog-body" :style="{ height: height + 'px' }">
      <system-setting />
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import SystemSetting from '@/components/SystemSetting'

export default {
  name: 'SystemUserCenterSetting',
  components: { SystemSetting },
  data() {
    return {
      name: '我的设置',
      height: 680
    }
  },
  created() {
    this.height = screenHeight(180)
  }
}
</script>
