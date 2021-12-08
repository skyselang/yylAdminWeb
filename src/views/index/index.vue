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
        <el-col :xs="24" :sm="14">
          <cms v-if="checkPermission(['admin/Index/cms'])" />
        </el-col>
        <el-col :xs="24" :sm="10">
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
import { message } from '@/api/index'

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
    this.message()
  },
  methods: {
    checkPermission,
    message() {
      message().then(res => {
        this.msgBox(res.data.list[0])
      }).catch(() => {})
    },
    msgBox(msg) {
      this.$confirm(msg.intro, msg.title, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '查看',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true
      }).then(() => {
        this.$router.push(`/admin/system/message-info?id=${msg.admin_message_id}`)
      }).catch(() => {})
    }
  }
}
</script>
