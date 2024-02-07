<template>
  <el-scrollbar native :height="height">
    <div class="app-container">
      <index-count v-if="checkPermission(['admin/system.Index/count'])" class="mb-[15px]" />
      <el-row class="mb-[15px]">
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
  </el-scrollbar>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import checkPermission from '@/utils/permission'
import IndexNotice from './components/IndexNotice.vue'
import IndexCount from './components/IndexCount.vue'
import IndexMember from './components/IndexMember.vue'
import IndexContent from './components/IndexContent.vue'
import IndexFile from './components/IndexFile.vue'

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
    this.height = screenHeight(130)
  },
  methods: {
    checkPermission
  }
}
</script>
