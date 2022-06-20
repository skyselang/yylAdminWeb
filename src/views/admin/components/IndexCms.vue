<template>
  <el-card v-loading="loading">
    <el-row>
      <el-col>
        <div id="echartIndexCms" style="height:500px; width:100%" />
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

import { cms } from '@/api/admin/index'

export default {
  name: 'AdminIndexCms',
  components: { },
  data() {
    return {
      name: '内容统计',
      loading: false
    }
  },
  computed: {},
  created() {
    this.cms()
  },
  mounted() {},
  methods: {
    cms() {
      this.loading = true
      cms().then(res => {
        this.echartIndexCms(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    echartIndexCms(data) {
      var echart = echarts.init(document.getElementById('echartIndexCms'))
      var option = {
        title: {
          text: '内容',
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
