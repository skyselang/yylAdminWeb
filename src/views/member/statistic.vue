<template>
  <el-scrollbar native :height="height">
    <div class="app-container">
      <el-row v-loading="loading" :gutter="10">
        <el-col v-for="(item, index) in count" :key="index" :xs="24" :span="3">
          <el-card :body-style="{ padding: '10px 0px' }">
            <template #header>
              <div class="text-center">
                <span>{{ item.name }}</span>
              </div>
            </template>
            <div class="text-center" :title="item.title">
              <el-statistic :value="item.count" />
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card
        v-for="(item, index) in echart_num"
        :key="index"
        v-loading="loading"
        class="mt-[10px]"
      >
        <el-row class="text-center">
          <el-col>
            <el-select v-model="date_type" class="!w-[100px]" @change="typeChange">
              <el-option :label="$t('common.day')" value="day" />
              <el-option :label="$t('common.month')" value="month" />
            </el-select>
            <el-date-picker
              v-model="date_range"
              :type="date_ptype"
              :value-format="date_format"
              :picker-options="date_options"
              :start-placeholder="$t('common.Start date')"
              :end-placeholder="$t('common.End date')"
              @change="dateChange"
            />
          </el-col>
          <el-col>
            <div :id="echart_id + index" :style="{ height: height - 300 + 'px' }"></div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </el-scrollbar>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { statistic } from '@/api/member/member'
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

export default {
  name: 'MemberStatistic',
  data() {
    return {
      name: '会员统计',
      height: 680,
      loading: false,
      count: [],
      echart_id: 'echartid',
      echart_num: 1,
      echart_data: [],
      date_type: 'day',
      date_range: [],
      date_options: {},
      date_ptype: 'monthrange',
      date_format: 'YYYY-MM',
      picker_options_day: {
        shortcuts: [
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近90天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 89)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近120天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 119)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      picker_options_month: {
        shortcuts: [
          {
            text: '最近3个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 2)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近6个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 5)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近9个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 8)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近12个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 11)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  watch: {
    echart_data() {
      this.$nextTick(() => {
        this.setEchart()
      })
    }
  },
  created() {
    this.height = screenHeight(140)
    this.statistic()
  },
  methods: {
    statistic() {
      this.loading = true
      statistic({
        type: this.date_type,
        date: this.date_range
      })
        .then((res) => {
          this.count = res.data.count
          this.echart_data = res.data.echart
          this.echart_num = res.data.echart.length
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
        this.date_options = this.picker_options_day
      } else if (type === 'month') {
        this.date_ptype = 'monthrange'
        this.date_format = 'YYYY-MM'
        this.date_options = this.picker_options_month
      }
    },
    dateChange() {
      this.statistic()
    },
    setEchart() {
      const data = this.echart_data
      const num = this.echart_num
      const id = this.echart_id
      for (let i = 0; i < num; i++) {
        this.initEchart(data[i], id + i)
        this.date_type = data[i].type
        this.date_range = data[i].date
      }
    },
    initEchart(data, id) {
      var myChart = echarts.init(document.getElementById(id))
      var option = {
        title: {
          text: data.title,
          textStyle: { fontSize: 12 }
        },
        legend: {
          top: '20px',
          data: data.legend,
          selected: { 总数: false }
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
            saveAsImage: { show: true, name: this.name + data.date[0] + '-' + data.date[1] }
          }
        },
        series: data.series
      }
      myChart.setOption(option)
    }
  }
}
</script>
