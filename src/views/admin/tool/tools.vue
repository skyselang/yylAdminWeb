<template>
  <div class="app-container">
    <el-tabs v-model="toolsTabName">
      <el-tab-pane label="字符串" name="string">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class=" filter-container">
              <ToolsStrRand />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <ToolsStrTran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="时间戳" name="timestamp">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <ToolsTimeTran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="二维码" name="qrcode">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <ToolsQrcode />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="字节转换" name="byte">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <ToolsByteTran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="IP查询" name="ip">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <ToolsIpQuery />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ToolsStrTran from './components/ToolsStrTran'
import ToolsStrRand from './components/ToolsStrRand'
import ToolsTimeTran from './components/ToolsTimeTran'
import ToolsQrcode from './components/ToolsQrcode'
import ToolsByteTran from './components/ToolsByteTran'
import ToolsIpQuery from './components/ToolsIpQuery'

export default {
  name: 'Tools',
  components: {
    ToolsStrTran,
    ToolsStrRand,
    ToolsTimeTran,
    ToolsQrcode,
    ToolsByteTran,
    ToolsIpQuery
  },
  data() {
    return {
      toolsTabName: 'string'
    }
  },
  created() {},
  methods: {}
}
</script>
