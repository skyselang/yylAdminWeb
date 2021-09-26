<template>
  <div>
    <el-card v-loading="loading">
      <el-row :gutter="0">
        <el-col :sm="24">
          <div id="echartIndexFile" style="height:500px; width:100%" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// ECharts
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core'
// 引入图表，图表后缀都为 Chart
import { PieChart } from 'echarts/charts'
// 引入组件，组件后缀都为 Component
import { TitleComponent, LegendComponent, TooltipComponent, GridComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([PieChart, TitleComponent, LegendComponent, TooltipComponent, GridComponent, CanvasRenderer])

import { file } from '@/api/index'

export default {
  name: 'IndexFile',
  components: { },
  data() {
    return {
      loading: false,
      date_pie: {
        count: 0,
        date: []
      }
    }
  },
  computed: {},
  created() {
    this.file()
  },
  mounted() {},
  methods: {
    file() {
      this.loading = true
      file().then(res => {
        this.echartIndexFile(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    echartIndexFile(data) {
      var echart = echarts.init(document.getElementById('echartIndexFile'))
      var option = {
        title: {
          text: '文件',
          subtext: '总计：' + data.count,
          left: 'center'
        },
        legend: {
          top: 'bottom'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          {
            name: '文件类型',
            type: 'pie',
            radius: [50, '60%'],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8,
              normal: {
                label: {
                  show: true,
                  formatter: '{b} : {c} ({d}%)'
                },
                labelLine: { show: true }
              }
            },
            data: data.data
          }
        ]
      }
      echart.setOption(option)
    }
  }
}
</script>

<style scoped>
</style>
