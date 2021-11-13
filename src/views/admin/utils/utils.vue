<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/strrand','admin/admin.Utils/strtran'])" label="字符串" lazy>
        <el-row :gutter="8">
          <el-col v-permission="['admin/admin.Utils/strrand']" :xs="24" :sm="12">
            <div class=" filter-container">
              <strrand />
            </div>
          </el-col>
          <el-col v-permission="['admin/admin.Utils/strtran']" :xs="24" :sm="12">
            <div class="filter-container">
              <Strtran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/timestamp'])" label="时间戳" lazy>
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <Timestamp />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/qrcode'])" label="二维码" lazy>
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <Qrcode />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/bytetran'])" label="字节" lazy>
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <Byte />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/ipinfo'])" label="IP" lazy>
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <Ip />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/map'])" label="地图" lazy>
        <el-row :gutter="8">
          <el-col :xs="24" :sm="24">
            <div class="filter-container">
              <Map />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/server'])" label="服务器" lazy>
        <el-row :gutter="8" class="dialog-body" :style="{height:height+60+'px'}">
          <el-col :xs="24" :sm="24">
            <div class="filter-container">
              <Server />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/toollu'])" label="在线工具" lazy>
        <el-row :gutter="8" class="dialog-body" :style="{height:height+60+'px'}">
          <el-col :xs="24" :sm="24">
            <div class="filter-container">
              <Toollu />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import checkPermission from '@/utils/permission' // 权限判断函数
import permission from '@/directive/permission/index.js' // 权限判断指令
import Strtran from './components/Strtran'
import Strrand from './components/Strrand'
import Timestamp from './components/Timestamp'
import Qrcode from './components/Qrcode'
import Byte from './components/Byte'
import Ip from './components/Ip'
import Map from './components/Map'
import Server from './components/Server'
import Toollu from './components/Toollu'

export default {
  name: 'AdminSystemUtils',
  components: { Strtran, Strrand, Timestamp, Qrcode, Byte, Ip, Map, Server, Toollu },
  directives: { permission },
  data() {
    return {
      height: 680
    }
  },
  created() {
    this.height = screenHeight()
  },
  methods: {
    checkPermission
  }
}
</script>
