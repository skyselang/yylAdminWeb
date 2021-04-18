<template>
  <div class="app-container">
    <el-row :gutter="0">
      <el-col :span="24">
        <member v-if="checkPermission(['admin/AdminIndex/member'])" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import Member from './components/Member'

export default {
  name: 'Index',
  components: { Member },
  data() {
    return {}
  },
  created() { },
  methods: {
    checkPermission
  }
}
</script>
