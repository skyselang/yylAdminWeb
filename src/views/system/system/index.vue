<template>
  <el-scrollbar :height="height">
    <div class="app-container">
      <Count v-if="hasPerm(['admin/system.Index/count'])" class="mb-[15px]" />
      <el-row class="mb-[15px]">
        <el-col>
          <Member v-if="hasPerm(['admin/system.Index/member'])" />
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="14">
          <Content v-if="hasPerm(['admin/system.Index/content'])" />
        </el-col>
        <el-col :xs="24" :sm="10">
          <File v-if="hasPerm(['admin/system.Index/file'])" />
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<script>
import { screenHeight, hasPerm } from '@/utils/index'
import Content from './component/Content.vue'
import Count from './component/Count.vue'
import File from './component/File.vue'
import Member from './component/Member.vue'

export default {
  name: 'Dashboard',
  components: { Content, Count, File, Member },
  data() {
    return {
      name: '首页',
      height: 680
    }
  },
  created() {
    this.height = screenHeight(130)
  },
  methods: {
    hasPerm
  }
}
</script>
