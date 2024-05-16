<template>
  <el-card v-loading="loading">
    <el-row>
      <el-col>
        <span>{{ name }}</span>
      </el-col>
      <el-col>
        <div id="echartIndexFile" class="h-[500px] w-[100%]"></div>
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

import { file } from '@/api/system/index'

export default {
  name: 'SystemIndexFile',
  data() {
    return {
      loading: false,
      date_pie: {
        count: 0,
        date: []
      }
    }
  },
  computed: {
    name() {
      return this.$t('file.File statistic')
    },
    files() {
      return this.$t('file.file')
    },
    file_type() {
      return this.$t('file.file type')
    }
  },
  watch: {
    name() {
      this.file()
    }
  },
  created() {
    this.file()
  },
  methods: {
    file() {
      this.loading = true
      file()
        .then((res) => {
          this.echartIndexFile(res.data)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    echartIndexFile(data) {
      var echart = echarts.init(document.getElementById('echartIndexFile'))
      var option = {
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
            data: data.data
          }
        ]
      }
      echart.setOption(option)
    }
  }
}
</script>
