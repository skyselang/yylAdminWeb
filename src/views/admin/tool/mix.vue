<template>
  <div class="app-container">
    <el-tabs v-model="toolTabName">
      <el-tab-pane label="字符串" name="string">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class=" filter-container">
              <MixStrRand />
            </div>
          </el-col>
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <MixStrTran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="时间戳" name="timestamp">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <MixTimeTran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="二维码" name="qrcode">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <MixQrcode />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="字节转换" name="byte">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <MixByteTran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="IP查询" name="ip">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <MixIpQuery />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MixStrTran from './components/MixStrTran'
import MixStrRand from './components/MixStrRand'
import MixTimeTran from './components/MixTimeTran'
import MixQrcode from './components/MixQrcode'
import MixByteTran from './components/MixByteTran'
import MixIpQuery from './components/MixIpQuery'

export default {
  name: 'ToolMix',
  components: {
    MixStrTran,
    MixStrRand,
    MixTimeTran,
    MixQrcode,
    MixByteTran,
    MixIpQuery
  },
  data() {
    return {
      toolTabName: 'string'
    }
  },
  created() {},
  methods: {}
}
</script>
