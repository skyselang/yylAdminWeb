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
import { PieChart } from 'echarts/charts'
// 引入组件，组件后缀都为 Component
import { TitleComponent, LegendComponent, TooltipComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([PieChart, TitleComponent, LegendComponent, TooltipComponent, CanvasRenderer])

import { uuid } from '@/utils/index'
import { fileApi as api } from '@/api/system/index'

export default {
  data() {
    return {
      id: uuid(),
      loading: false,
      date_pie: {
        count: 0,
        date: []
      }
    }
  },
  computed: {
    name() {
      return this.$t('文件统计')
    },
    files() {
      return this.$t('文件')
    },
    file_type() {
      return this.$t('文件类型')
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
          subtext: this.files + '：' + data.count,
          left: 'center'
        },
        legend: {
          left: 'center',
          top: 'bottom'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: this.file_type,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
              label: {
                show: true,
                formatter: '{b} : {c} ({d}%)'
              }
            },
            label: {
              formatter: '{b}：{@c} ({d}%)'
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
