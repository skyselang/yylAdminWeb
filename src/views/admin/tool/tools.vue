<template>
  <div class="app-container">
    <el-row :gutter="8">
      <el-col :sm="{span:24}" :md="{span:12}">
        <div class="filter-container">
          <ToolsString />
        </div>
      </el-col>
      <el-col :sm="{span:24}" :md="{span:12}">
        <div class=" filter-container">
          <ToolsStrRan />
        </div>
      </el-col>
      <el-col :sm="{span:24}" :md="{span:12}">
        <div class="filter-container">
          <ToolsTimestamp />
        </div>
      </el-col>
      <el-col :sm="{span:24}" :md="{span:12}">
        <div class="filter-container">
          <ToolsQrcode />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ToolsString from './components/ToolsString'
import ToolsStrRan from './components/ToolsStrRan'
import ToolsTimestamp from './components/ToolsTimestamp'
import ToolsQrcode from './components/ToolsQrcode'

export default {
  name: 'Tools',
  components: { ToolsString, ToolsStrRan, ToolsTimestamp, ToolsQrcode },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
