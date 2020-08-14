<template>
  <el-card class="box-card">
    <el-row :gutter="0">
      <el-col :sm="{span:23,offset:0}" :md="{span:23,offset:1}">
        <el-date-picker v-model="data.dates" type="daterange" range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="max-width:280px" @change="visitChange" />
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :sm="24">
        <div id="visitEchartDate" style="width:100%;height:400px" />
      </el-col>
    </el-row>
  </el-card>

</template>

<script>
import { visitDate } from '@/api/admin'
import echarts from 'echarts'

export default {
  name: 'VisitEchartDate',
  components: {},
  data() {
    return {
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
          this.visitEchartDate(res.data)
        })
        .catch(() => {})
    },
    visitChange() {
      this.visit()
    },
    visitEchartDate(data) {
      var visitEchartDate = echarts.init(
        document.getElementById('visitEchartDate')
      )
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
      visitEchartDate.setOption(option)
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
