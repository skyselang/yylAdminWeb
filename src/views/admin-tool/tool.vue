<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-col :span="12">
        <div class="filter-container">
          <RandomStr />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="filter-container">
          <Timestamp />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="12">
        <div class="filter-container">
          <Md5Enc />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="filter-container">
          <Qrcode />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RandomStr from './components/RandomStr'
import Timestamp from './components/Timestamp'
import Md5Enc from './components/Md5Enc'
import Qrcode from './components/Qrcode'

export default {
  name: 'Tool',
  components: { RandomStr, Timestamp, Md5Enc, Qrcode },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
