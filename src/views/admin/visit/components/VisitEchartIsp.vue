<template>
  <el-card class="box-card">
    <el-row :gutter="0">
      <el-col :sm="{span:23,offset:0}" :md="{span:23,offset:1}">
        <el-date-picker v-model="data.dates" type="daterange" range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="max-width:280px" @change="visitChange" />
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :sm="24">
        <div id="visitEchartIsp" style="width:100%;height:500px" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { visitIsp } from '@/api/admin'
import echarts from 'echarts'

export default {
  name: 'VisitEchartIsp',
  components: {},
  data() {
    return {
      data: {
        isp: [],
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
      visitIsp({
        date: this.data.dates
      })
        .then(res => {
          this.data = res.data
          this.visitEchartIsp(res.data)
        })
        .catch(() => {})
    },
    visitChange() {
      this.visit()
    },
    visitEchartIsp(data) {
      var visitEchartIsp = echarts.init(
        document.getElementById('visitEchartIsp')
      )
      var option = {
        title: {
          text: 'ISP',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: '3%',
          top: '20px',
          data: data.isp
        },
        series: [
          {
            name: 'ISP',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: data.num,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      visitEchartIsp.setOption(option)
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
