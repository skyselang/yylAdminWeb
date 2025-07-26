<template>
  <el-scrollbar :height="height">
    <div class="app-container">
      <el-row v-loading="loading" :gutter="10">
        <el-col v-for="(item, index) in count" :key="index" :xs="24" :span="3">
          <el-card :body-style="{ padding: '10px 0px' }" shadow="never">
            <template #header>
              <div class="text-center">
                <el-text size="default">{{ item.name }}</el-text>
              </div>
            </template>
            <div class="text-center" :title="item.title">
              <el-statistic :value="item.count" />
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card v-for="(item, index) in echart_num" :key="index" v-loading="loading" class="mt-[10px]" shadow="never">
        <el-row class="text-center">
          <el-col>
            <el-select v-model="date_type" class="!w-[100px]" @change="typeChange">
              <el-option :label="$t('日')" value="day" />
              <el-option :label="$t('月')" value="month" />
            </el-select>
            <el-date-picker
              v-model="date_range"
              :type="date_ptype"
              :value-format="date_format"
              :shortcuts="date_options"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
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
import { screenHeight } from '@/utils/index'
import { statisticApi } from '@/api/member/statistic'
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

export default {
  name: 'MemberStatistic',
  data() {
    return {
      name: '',
      height: 680,
      loading: false,
      count: [],
      echart_id: 'member',
      echart_num: 1,
      echart_data: [],
      date_type: 'day',
      date_range: [],
      date_ptype: 'monthrange',
      date_format: 'YYYY-MM',
      date_options: [],
      date_options_day: [],
      date_options_month: []
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
    this.name = this.$t('会员统计')
    this.statistic()
    this.height = screenHeight(140)
    this.date_options_day = [
      {
        text: this.$t('最近7天'),
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
          return [start, end]
        }
      },
      {
        text: this.$t('最近30天'),
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
          return [start, end]
        }
      },
      {
        text: this.$t('最近90天'),
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 89)
          return [start, end]
        }
      },
      {
        text: this.$t('最近120天'),
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 119)
          return [start, end]
        }
      }
    ]

    this.date_options_month = [
      {
        text: this.$t('最近3个月'),
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setMonth(start.getMonth() - 2)
          return [start, end]
        }
      },
      {
        text: this.$t('最近6个月'),
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setMonth(start.getMonth() - 5)
          return [start, end]
        }
      },
      {
        text: this.$t('最近9个月'),
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setMonth(start.getMonth() - 8)
          return [start, end]
        }
      },
      {
        text: this.$t('最近12个月'),
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setMonth(start.getMonth() - 11)
          return [start, end]
        }
      }
    ]
  },
  methods: {
    statistic() {
      this.loading = true
      statisticApi({
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
        this.date_options = this.date_options_day
      } else if (type === 'month') {
        this.date_ptype = 'monthrange'
        this.date_format = 'YYYY-MM'
        this.date_options = this.date_options_month
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
      const echart = echarts.init(document.getElementById(id))
      const option = {
        title: {
          text: data.title,
          textStyle: { fontSize: 12 }
        },
        legend: {
          top: '20px',
          data: data.legend,
          selected: { [this.$t('总数')]: false }
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
      echart.setOption(option)
    }
  }
}
</script>
