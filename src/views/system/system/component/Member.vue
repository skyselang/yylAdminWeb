<template>
  <el-card v-loading="loading" shadow="never">
    <el-row>
      <el-text size="default">{{ name }}</el-text>
      <el-col class="text-center">
        <el-select v-model="date_type" class="!w-[100px]" @change="dateType">
          <el-option :label="$t('日')" value="day" />
          <el-option :label="$t('月')" value="month" />
        </el-select>
        <el-date-picker
          v-model="date_range"
          :type="date_ptype"
          :value-format="date_format"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          @change="dateChange"
        />
      </el-col>
      <el-col>
        <div :id="id" :style="{ height: height + 'px' }"></div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
// ECharts
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core'
// 引入图表，图表后缀都为 Chart
import { LineChart, BarChart } from 'echarts/charts'
// 引入组件，组件后缀都为 Component
import { TitleComponent, LegendComponent, GridComponent, TooltipComponent, ToolboxComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([
  LineChart,
  BarChart,
  TitleComponent,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  ToolboxComponent,
  CanvasRenderer
])
import { uuid } from '@/utils/index'
import { memberApi as api } from '@/api/system/index'

export default {
  data() {
    return {
      id: uuid(),
      height: 500,
      loading: false,
      date_type: 'day',
      date_range: [],
      date_ptype: 'monthrange',
      date_format: 'YYYY-MM'
    }
  },
  computed: {
    name() {
      return this.$t('会员统计')
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
      api({
        type: this.date_type,
        date: this.date_range
      })
        .then((res) => {
          this.date_type = res.data.number.type
          this.date_range = res.data.number.date
          this.dateEchart(res.data.number)
          this.dateOptions()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    dateType() {
      this.dateOptions()
      this.date_range = []
    },
    dateOptions() {
      if (this.date_type === 'day') {
        this.date_ptype = 'daterange'
        this.date_format = 'YYYY-MM-DD'
      } else if (this.date_type === 'month') {
        this.date_ptype = 'monthrange'
        this.date_format = 'YYYY-MM'
      }
    },
    dateChange() {
      this.init()
    },
    dateEchart(data) {
      let echart = echarts.init(document.getElementById(this.id))
      let option = {
        title: {
          left: 'center'
        },
        legend: {
          top: '20px',
          data: data.legend,
          selected: data.selected
        },
        grid: {
          top: '80px',
          left: '1%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.xAxis
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          }
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            dataView: { show: true, readOnly: true },
            saveAsImage: {
              show: true,
              name: this.name + data.date[0] + '-' + data.date[1]
            }
          }
        },
        series: data.series
      }
      echart.setOption(option)
    }
  }
}
</script>
