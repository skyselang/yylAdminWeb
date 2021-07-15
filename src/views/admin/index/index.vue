<template>
  <div class="app-container">
    <el-row :gutter="0">
      <el-col :span="24">
        <member v-if="checkPermission(['admin/admin.Index/member'])" />
      </el-col>
      <el-col :span="24">
        <cms v-if="checkPermission(['admin/admin.Index/cms'])" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import Member from './components/Member'
import Cms from './components/Cms'

export default {
  name: 'Dashboard',
  components: { Member, Cms },
  data() {
    return {}
  },
  created() { },
  methods: {
    checkPermission
  }
}
</script>
