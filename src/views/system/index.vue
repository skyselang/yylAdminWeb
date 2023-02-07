<template>
  <div class="dialog-body" :style="{height:height+'px'}">
    <el-row>
      <el-col>
        <index-count v-if="checkPermission(['admin/system.Index/count'])" />
      </el-col>
    </el-row>
    <div class="app-container">
      <el-row style="margin-bottom:15px">
        <el-col>
          <index-member v-if="checkPermission(['admin/system.Index/member'])" />
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="14">
          <index-content v-if="checkPermission(['admin/system.Index/content'])" />
        </el-col>
        <el-col :xs="24" :sm="10">
          <index-file v-if="checkPermission(['admin/system.Index/file'])" />
        </el-col>
      </el-row>
    </div>
    <index-notice />
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import checkPermission from '@/utils/permission' // 权限判断函数
import IndexNotice from './components/IndexNotice'
import IndexCount from './components/IndexCount'
import IndexMember from './components/IndexMember'
import IndexContent from './components/IndexContent'
import IndexFile from './components/IndexFile'

export default {
  name: 'Dashboard',
  components: { IndexNotice, IndexCount, IndexMember, IndexFile, IndexContent },
  data() {
    return {
      name: '控制台',
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
