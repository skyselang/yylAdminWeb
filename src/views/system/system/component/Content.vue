<template>
  <el-card v-loading="loading" shadow="never">
    <el-row>
      <el-col>
        <el-text size="default">{{ name }}</el-text>
      </el-col>
      <el-col>
        <div :id="id" class="h-[500px] w-[100%]"></div>
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

import { uuid } from '@/utils/index'
import { contentApi as api } from '@/api/system/index'

export default {
  data() {
    return {
      id: uuid(),
      loading: false
    }
  },
  computed: {
    name() {
      return this.$t('内容统计')
    },
    contents() {
      return this.$t('内容')
    },
    category() {
      return this.$t('分类')
    }
  },
  watch: {
    name() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      api()
        .then((res) => {
          this.echart(res.data)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    echart(data) {
      let echart = echarts.init(document.getElementById(this.id))
      let option = {
        title: {
          subtext: this.category + '：' + data.category + '，' + this.contents + '：' + data.content,
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
