<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/strrand','admin/admin.Utils/strtran'])" label="字符串" lazy>
        <el-row :gutter="8">
          <el-col v-permission="['admin/admin.Utils/strrand']" :xs="24" :sm="12">
            <div class="filter-container">
              <utils-strrand />
            </div>
          </el-col>
          <el-col v-permission="['admin/admin.Utils/strtran']" :xs="24" :sm="12">
            <div class="filter-container">
              <utils-strtran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/timestamp'])" label="时间戳" lazy>
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <utils-timestamp />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/qrcode'])" label="二维码" lazy>
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <utils-qrcode />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/bytetran'])" label="字节" lazy>
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <utils-bytetran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/ipinfo'])" label="IP" lazy>
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <utils-ipinfo />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/map'])" label="地图" lazy>
        <el-row :gutter="8">
          <el-col>
            <div class="filter-container">
              <utils-map />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/server'])" label="服务器" lazy>
        <el-row :gutter="8">
          <el-col>
            <div class="filter-container">
              <utils-server />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/toollu'])" label="在线工具" lazy>
        <el-row :gutter="8">
          <el-col>
            <div class="filter-container">
              <utils-toollu />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/huatools'])" label="IT在线工具" lazy>
        <el-row :gutter="8">
          <el-col>
            <div class="filter-container">
              <utils-huatools />
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
import UtilsMap from './components/UtilsMap'
import UtilsServer from './components/UtilsServer'
import UtilsToollu from './components/UtilsToollu'
import UtilsHuatools from './components/UtilsHuatools'

export default {
  name: 'AdminSystemUtils',
  components: { UtilsStrtran, UtilsStrrand, UtilsTimestamp, UtilsQrcode, UtilsBytetran, UtilsIpinfo, UtilsMap, UtilsServer, UtilsToollu, UtilsHuatools },
  directives: { permission },
  data() {
    return {
      name: '实用工具'
    }
  },
  created() {},
  methods: {
    checkPermission
  }
}
</script>
