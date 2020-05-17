<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :span="24">
          <UsersTotal />
        </el-col>
      </el-row>

      <el-row :gutter="0" style="margin-top:10px">
        <el-card class="box-card">
          <line-chart :chart-data="lineChartData" />
        </el-card>
      </el-row>
    </div>
  </div>
</template>

<script>
import UsersTotal from './components/UsersTotal'
import LineChart from './components/LineChart'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
export default {
  name: 'Dashboard',
  components: { UsersTotal, LineChart },
  data() {
    return { lineChartData: lineChartData.newVisitis }
  },
  computed: {},
  created() {}
}
</script>
