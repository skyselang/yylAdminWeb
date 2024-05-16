<template>
  <el-card v-loading="loading">
    <el-row>
      <span>{{ name }}</span>
      <el-col class="text-center">
        <el-select v-model="date_type" class="!w-[100px]" @change="typeChange">
          <el-option :label="$t('common.day')" value="day" />
          <el-option :label="$t('common.month')" value="month" />
        </el-select>
        <el-date-picker
          v-model="date_range"
          :type="date_ptype"
          :value-format="date_format"
          :start-placeholder="$t('common.Start date')"
          :end-placeholder="$t('common.End date')"
          @change="dateChange"
        />
      </el-col>
      <el-col>
        <div id="numberEchart" :style="{ height: height + 'px' }"></div>
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
import {
  TitleComponent,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  ToolboxComponent
} from 'echarts/components'
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

import { member as stat } from '@/api/system/index'

export default {
  name: 'SystemIndexMember',
  data() {
    return {
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
      return this.$t('member.Member statistic')
    }
  },
  watch: {
    name() {
      this.stat()
    }
  },
  created() {
    this.stat()
  },
  methods: {
    stat() {
      this.loading = true
      stat({
        type: this.date_type,
        date: this.date_range
      })
        .then((res) => {
          this.date_type = res.data.number.type
          this.date_range = res.data.number.date
          this.dateEchart(res.data.number, 'numberEchart')
          this.dateOptions()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    typeChange() {
      this.dateOptions()
      this.date_range = []
    },
    dateOptions() {
      const type = this.date_type
      if (type === 'day') {
        this.date_ptype = 'daterange'
        this.date_format = 'YYYY-MM-DD'
      } else if (type === 'month') {
        this.date_ptype = 'monthrange'
        this.date_format = 'YYYY-MM'
      }
    },
    dateChange() {
      this.stat()
    },
    dateEchart(data, id) {
      var echart = echarts.init(document.getElementById(id))
      var option = {
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
