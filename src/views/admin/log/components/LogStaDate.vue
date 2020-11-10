<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24">
          <el-date-picker v-model="data.date" type="daterange" range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="max-width:280px" @change="dateChange" />
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
import { logStatistic } from '@/api/admin'
import echarts from 'echarts'

export default {
  name: 'LogStaDate',
  components: {},
  data() {
    return {
      height: 680,
      type: 'date',
      data: {
        x_data: [],
        y_data: [],
        date: []
      }
    }
  },
  created() {
    this.logStatistic()
  },
  mounted() {},
  methods: {
    logStatistic() {
      logStatistic({
        type: this.type,
        date: this.data.date
      })
        .then(res => {
          this.data = res.data
          this.echart(res.data)
        })
        .catch(() => {})
    },
    dateChange() {
      this.height = screenHeight()
      this.logStatistic()
    },
    echart(data) {
      var echart = echarts.init(document.getElementById('echart'))
      var option = {
        title: {
          text: '',
          left: 'center',
          textStyle: {
            color: '#666',
            fontSize: 14
          }
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
          data: data.x_data
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data.y_data,
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
