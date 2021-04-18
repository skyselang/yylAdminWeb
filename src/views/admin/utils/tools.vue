<template>
  <div class="app-container">
    <el-tabs v-model="toolTabName">
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/strrand','admin/AdminUtils/strtran'])" label="字符串" name="string">
        <el-row :gutter="8">
          <el-col v-permission="['admin/AdminUtils/strrand']" :xs="24" :sm="12">
            <div class=" filter-container">
              <utils-strrand />
            </div>
          </el-col>
          <el-col v-permission="['admin/AdminUtils/strtran']" :xs="24" :sm="12">
            <div class="filter-container">
              <utils-strtran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/timestamp'])" label="时间戳" name="timestamp">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <utils-timestamp />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/qrcode'])" label="二维码" name="qrcode">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <utils-qrcode />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/bytetran'])" label="字节" name="byte">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <utils-bytetran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/ipinfo'])" label="IP" name="ip">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <utils-ipinfo />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import permission from '@/directive/permission/index.js' // 权限判断指令
import UtilsStrtran from './components/UtilsStrtran'
import UtilsStrrand from './components/UtilsStrrand'
import UtilsTimestamp from './components/UtilsTimestamp'
import UtilsQrcode from './components/UtilsQrcode'
import UtilsBytetran from './components/UtilsBytetran'
import UtilsIpinfo from './components/UtilsIpinfo'

export default {
  name: 'Tools',
  directives: { permission },
  components: { UtilsStrtran, UtilsStrrand, UtilsTimestamp, UtilsQrcode, UtilsBytetran, UtilsIpinfo },
  data() {
    return {
      toolTabName: 'string'
    }
  },
  created() { },
  methods: { checkPermission }
}
</script>
