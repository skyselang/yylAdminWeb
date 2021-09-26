<template>
  <div class="dialog-body" :style="{height:height+'px'}">
    <el-row :gutter="0">
      <el-col :span="24">
        <count v-if="checkPermission(['admin/Index/count'])" />
      </el-col>
    </el-row>
    <div class="app-container">
      <el-row :gutter="0">
        <el-col :span="24">
          <member v-if="checkPermission(['admin/Index/member'])" />
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="15">
          <cms v-if="checkPermission(['admin/Index/cms'])" />
        </el-col>
        <el-col :xs="24" :sm="9">
          <file v-if="checkPermission(['admin/Index/file'])" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import checkPermission from '@/utils/permission' // 权限判断函数
import Count from './components/Count'
import Member from './components/Member'
import File from './components/File'
import Cms from './components/Cms'

export default {
  name: 'Dashboard',
  components: { Count, Member, File, Cms },
  data() {
    return {
      height: 680
    }
  },
  created() {
    this.height = screenHeight(100)
  },
  methods: {
    checkPermission
  }
}
</script>
