<template>
  <div class="app-container">
    <el-tabs v-model="toolsTabName">
      <el-tab-pane label="字符串" name="string">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class=" filter-container">
              <GatherStrRand />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <GatherStrTran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="时间戳" name="timestamp">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <GatherTimeTran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="二维码" name="qrcode">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <GatherQrcode />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="字节转换" name="byte">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <GatherByteTran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="IP查询" name="ip">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <GatherIpQuery />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import GatherStrTran from './components/GatherStrTran'
import GatherStrRand from './components/GatherStrRand'
import GatherTimeTran from './components/GatherTimeTran'
import GatherQrcode from './components/GatherQrcode'
import GatherByteTran from './components/GatherByteTran'
import GatherIpQuery from './components/GatherIpQuery'

export default {
  name: 'Gather',
  components: {
    GatherStrTran,
    GatherStrRand,
    GatherTimeTran,
    GatherQrcode,
    GatherByteTran,
    GatherIpQuery
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
