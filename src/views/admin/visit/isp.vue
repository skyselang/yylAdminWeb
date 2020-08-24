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
import { visitIsp } from '@/api/admin'
import echarts from 'echarts'

export default {
  name: 'Isp',
  components: {},
  data() {
    return {
      height: 680,
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
          this.echart(res.data)
        })
        .catch(() => {})
    },
    dateChange() {
      this.visit()
    },
    echart(data) {
      var echart = echarts.init(document.getElementById('echart'))
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
      echart.setOption(option)
    }
  }
}
</script>
