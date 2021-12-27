<template>
  <div class="dialog-body" :style="{height:height+'px'}">
    <el-row>
      <el-col>
        <index-count v-if="checkPermission(['admin/Index/count'])" />
      </el-col>
    </el-row>
    <div class="app-container">
      <el-row>
        <el-col>
          <index-member v-if="checkPermission(['admin/Index/member'])" />
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="14">
          <index-cms v-if="checkPermission(['admin/Index/cms'])" />
        </el-col>
        <el-col :xs="24" :sm="10">
          <index-file v-if="checkPermission(['admin/Index/file'])" />
        </el-col>
      </el-row>
    </div>
    <index-message />
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import checkPermission from '@/utils/permission' // 权限判断函数
import IndexMessage from './components/IndexMessage'
import IndexCount from './components/IndexCount'
import IndexMember from './components/IndexMember'
import IndexCms from './components/IndexCms'
import IndexFile from './components/IndexFile'

export default {
  name: 'Dashboard',
  components: { IndexMessage, IndexCount, IndexMember, IndexFile, IndexCms },
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
