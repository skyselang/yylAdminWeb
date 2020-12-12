<template>
  <div class="app-container">
    <el-tabs v-model="toolTabName">
      <el-tab-pane v-if="checkPermission(['admin/AdminTool/strRand','admin/AdminTool/strTran'])" label="字符串" name="string">
        <el-row :gutter="8">
          <el-col v-permission="['admin/AdminTool/strRand']" :xs="24" :sm="12">
            <div class=" filter-container">
              <mix-str-rand />
            </div>
          </el-col>
          <el-col v-permission="['admin/AdminTool/strTran']" :xs="24" :sm="12">
            <div class="filter-container">
              <mix-str-tran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminTool/timeTran'])" label="时间戳" name="timestamp">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <mix-time-tran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminTool/qrcode'])" label="二维码" name="qrcode">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <mix-qrcode />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminTool/byteTran'])" label="字节转换" name="byte">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <mix-byte-tran />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['admin/AdminTool/admin/AdminTool/ipQuery'])" label="IP查询" name="ip">
        <el-row :gutter="8">
          <el-col :xs="24" :sm="12">
            <div class="filter-container">
              <mix-ip-query />
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
import MixStrTran from './components/MixStrTran'
import MixStrRand from './components/MixStrRand'
import MixTimeTran from './components/MixTimeTran'
import MixQrcode from './components/MixQrcode'
import MixByteTran from './components/MixByteTran'
import MixIpQuery from './components/MixIpQuery'

export default {
  name: 'ToolMix',
  directives: { permission },
  components: { MixStrTran, MixStrRand, MixTimeTran, MixQrcode, MixByteTran, MixIpQuery },
  data() {
    return {
      toolTabName: 'string'
    }
  },
  created() { },
  methods: { checkPermission }
}
</script>
