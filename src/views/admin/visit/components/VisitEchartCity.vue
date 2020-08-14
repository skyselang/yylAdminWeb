<template>
  <el-card class="box-card">
    <el-row :gutter="0">
      <el-col :sm="{span:23,offset:0}" :md="{span:23,offset:1}">
        <el-date-picker v-model="data.dates" type="daterange" range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="max-width:280px" @change="visitChange" />
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :sm="24">
        <div id="visitEchartCity" style="width:100%;height:400px" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { visitCity } from '@/api/admin'
import echarts from 'echarts'

export default {
  name: 'VisitEchartCity',
  components: {},
  data() {
    return {
      data: {
        city: [],
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
      visitCity({
        date: this.data.dates
      })
        .then(res => {
          this.data = res.data
          this.visitEchartCity(res.data)
        })
        .catch(() => {})
    },
    visitChange() {
      this.visit()
    },
    visitEchartCity(data) {
      var visitEchartCity = echarts.init(
        document.getElementById('visitEchartCity')
      )
      var option = {
        title: {
          text: 'CITY',
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
        xAxis: [
          {
            type: 'category',
            data: data.city,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '60%',
            data: data.num
          }
        ]
      }
      visitEchartCity.setOption(option)
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
