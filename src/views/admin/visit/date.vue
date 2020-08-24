<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24">
          <el-date-picker v-model="data.dates" type="daterange" range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="max-width:280px" @change="dateChange" />
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :sm="24">
          <div id="echart" :style="{height:height+'px'}" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { visitDate } from '@/api/admin'
import echarts from 'echarts'

export default {
  name: 'Date',
  components: {},
  data() {
    return {
      height: 680,
      data: {
        date: [],
        num: [],
        dates: []
      }
    }
  },
  created() {
    this.visit()
  },
  mounted() {},
  methods: {
    visit() {
      visitDate({
        date: this.data.dates
      })
        .then(res => {
          this.data = res.data
          this.echart(res.data)
        })
        .catch(() => {})
    },
    dateChange() {
      this.height = screenHeight()
      this.visit()
    },
    echart(data) {
      var echart = echarts.init(document.getElementById('echart'))
      var option = {
        title: {
          text: 'DATE',
          left: 'center'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.date
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data.num,
            type: 'line',
            areaStyle: {}
          }
        ]
      }
      echart.setOption(option)
    }
  }
}
</script>

<style scoped>
.box-card .text {
  color: #666;
  font-size: 20px;
  line-height: 32px;
  font-weight: 700;
}
</style>
