<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24">
          <div id="echartFile" style="height:500px; width:100%" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// ECharts
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { PieChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, LegendComponent, TooltipComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([PieChart, TitleComponent, LegendComponent, TooltipComponent, CanvasRenderer])

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
        this.echartFile(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    echartFile(data) {
      var echart = echarts.init(document.getElementById('echartFile'))
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
          trigger: 'item'
        },
        series: [
          {
            name: '文件类型',
            type: 'pie',
            radius: [50, '60%'],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
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
.box-card {
  text-align: center;
}
.box-card .text {
  color: #666;
  font-size: 20px;
  line-height: 32px;
  font-weight: 700;
  text-align: center;
}
.el-row {
  margin-bottom: 10px;
}
.color-tot {
  color: #1890ff;
}
.color-new {
  color: #1890ff;
  border-right: 1px solid #e6ebf5;
}
.color-act {
  color: #13ce66;
}
</style>
