<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/strrand','admin/admin.Utils/strtran'])" label="字符串" name="str">
        <el-row :gutter="8">
          <el-col v-permission="['admin/admin.Utils/strrand']" :sm="24" :md="12">
            <div class=" filter-container">
              <Strrand v-if="str" />
            </div>
          </el-col>
          <el-col v-permission="['admin/admin.Utils/strtran']" :sm="24" :md="12">
            <div class="filter-container">
              <Strtran v-if="str" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/timestamp'])" label="时间戳" name="timestamp">
        <el-row :gutter="8">
          <el-col :sm="24" :md="12">
            <div class="filter-container">
              <Timestamp v-if="timestamp" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/qrcode'])" label="二维码" name="qrcode">
        <el-row :gutter="8">
          <el-col :sm="24" :md="12">
            <div class="filter-container">
              <Qrcode v-if="qrcode" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/bytetran'])" label="字节" name="byte">
        <el-row :gutter="8">
          <el-col :sm="24" :md="12">
            <div class="filter-container">
              <Byte v-if="byte" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/ipinfo'])" label="IP" name="ip">
        <el-row :gutter="8">
          <el-col :sm="24" :md="12">
            <div class="filter-container">
              <Ip v-if="ip" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/map'])" label="地图" name="map">
        <el-row :gutter="8">
          <el-col :sm="24" :md="24">
            <div class="filter-container">
              <Map v-if="map" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/server'])" label="服务器" name="server">
        <el-row :gutter="8" class="dialog-body" :style="{height:height+60+'px'}">
          <el-col :sm="24" :md="24">
            <div class="filter-container">
              <Server v-if="server" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/admin.Utils/toollu'])" label="在线工具" name="toollu">
        <el-row :gutter="8" class="dialog-body" :style="{height:height+60+'px'}">
          <el-col :sm="24" :md="24">
            <div class="filter-container">
              <Toollu v-if="toollu" />
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
  name: 'AdminUtils',
  directives: { permission },
  components: { Strtran, Strrand, Timestamp, Qrcode, Byte, Ip, Map, Server, Toollu },
  data() {
    return {
      height: 680,
      str: true,
      timestamp: false,
      qrcode: false,
      byte: false,
      ip: false,
      map: false,
      server: false,
      toollu: false,
      actTabName: 'str'
    }
  },
  created() {
    this.height = screenHeight()
  },
  methods: {
    checkPermission,
    tabClick(tab) {
      this[tab.name] = true
    }
  }
}
</script>
