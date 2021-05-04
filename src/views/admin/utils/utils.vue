<template>
  <div class="app-container">
    <el-tabs v-model="actTabName" @tab-click="tabClick">
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/strrand','admin/AdminUtils/strtran'])" label="字符串" name="str">
        <el-row :gutter="8">
          <el-col v-permission="['admin/AdminUtils/strrand']" :sm="24" :md="12">
            <div class=" filter-container">
              <Strrand v-if="str" />
            </div>
          </el-col>
          <el-col v-permission="['admin/AdminUtils/strtran']" :sm="24" :md="12">
            <div class="filter-container">
              <Strtran v-if="str" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/timestamp'])" label="时间戳" name="timestamp">
        <el-row :gutter="8">
          <el-col :sm="24" :md="12">
            <div class="filter-container">
              <Timestamp v-if="timestamp" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/qrcode'])" label="二维码" name="qrcode">
        <el-row :gutter="8">
          <el-col :sm="24" :md="12">
            <div class="filter-container">
              <Qrcode v-if="qrcode" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/bytetran'])" label="字节" name="byte">
        <el-row :gutter="8">
          <el-col :sm="24" :md="12">
            <div class="filter-container">
              <Byte v-if="byte" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/ipinfo'])" label="IP" name="ip">
        <el-row :gutter="8">
          <el-col :sm="24" :md="12">
            <div class="filter-container">
              <Ip v-if="ip" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/map'])" label="地图" name="map">
        <el-row :gutter="8">
          <el-col :sm="24" :md="24">
            <div class="filter-container">
              <Map v-if="map" />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminUtils/server'])" label="服务器" name="server">
        <el-row :gutter="8">
          <el-col :sm="24" :md="12">
            <div class="filter-container">
              <Server v-if="server" />
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
import Strtran from './components/Strtran'
import Strrand from './components/Strrand'
import Timestamp from './components/Timestamp'
import Qrcode from './components/Qrcode'
import Byte from './components/Byte'
import Ip from './components/Ip'
import Map from './components/Map'
import Server from './components/Server'

export default {
  name: 'Utils',
  directives: { permission },
  components: { Strtran, Strrand, Timestamp, Qrcode, Byte, Ip, Map, Server },
  data() {
    return {
      str: true,
      timestamp: false,
      qrcode: false,
      byte: false,
      ip: false,
      map: false,
      server: false,
      actTabName: 'str'
    }
  },
  created() { },
  methods: {
    checkPermission,
    tabClick(tab) {
      this[tab.name] = true
    }
  }
}
</script>
