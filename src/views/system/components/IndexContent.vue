<template>
  <el-card v-loading="loading">
    <el-row>
      <el-col>
        <span>{{ name }}</span>
      </el-col>
      <el-col>
        <div id="echartIndexContent" style="height:500px; width:100%" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
// ECharts
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core'
// 引入图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts'
// 引入组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer])

import { content } from '@/api/system/index'

export default {
  name: 'SystemIndexContent',
  components: {},
  data() {
    return {
      name: '内容统计',
      loading: false
    }
  },
  computed: {},
  created() {
    this.content()
  },
  mounted() { },
  methods: {
    content() {
      this.loading = true
      content().then(res => {
        this.echartIndexContent(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    echartIndexContent(data) {
      var echart = echarts.init(document.getElementById('echartIndexContent'))
      var option = {
        title: {
          subtext: '分类：' + data.category + '，内容：' + data.content,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.x_data
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data.s_data,
            type: 'bar',
            label: {
              show: true,
              position: 'top'
            }
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
