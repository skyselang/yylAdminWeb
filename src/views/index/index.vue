<template>
  <div class="app-container">
    <el-row :gutter="0">
      <el-col :span="24">
        <member v-if="checkPermission(['admin/Index/member'])" />
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="12">
        <cms v-if="checkPermission(['admin/Index/cms'])" />
      </el-col>
      <el-col :span="12">
        <file v-if="checkPermission(['admin/Index/file'])" />
      </el-col>
    </el-row>
    <back-to-top transition-name="fade" />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import BackToTop from '@/components/BackToTop'
import Member from './components/Member'
import File from './components/File'
import Cms from './components/Cms'

export default {
  name: 'Dashboard',
  components: { BackToTop, Member, File, Cms },
  data() {
    return {}
  },
  created() { },
  methods: {
    checkPermission
  }
}
</script>
