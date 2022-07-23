<template>
  <el-card v-loading="loading">
    <el-row style="text-align:center;">
      <el-col>
        <el-select v-model="date_type" class="filter-item" @change="typeChange">
          <el-option label="日" value="day" />
          <el-option label="月" value="month" />
        </el-select>
        <el-date-picker
          v-model="date_range"
          class="filter-item"
          style="width:350px"
          :type="date_ptype"
          :value-format="date_format"
          :picker-options="date_options"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateChange"
        />
      </el-col>
      <el-col>
        <div id="numberEchart" :style="{height:height+'px'}" />
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
echarts.use([LineChart, BarChart, TitleComponent, LegendComponent, GridComponent, TooltipComponent, ToolboxComponent, CanvasRenderer])

import { member as stat } from '@/api/admin/index'

export default {
  name: 'AdminMemberStat',
  components: { },
  directives: { },
  data() {
    return {
      name: '会员统计',
      height: 500,
      loading: false,
      date_type: 'day',
      date_range: [],
      date_ptype: 'monthrange',
      date_format: 'yyyy-MM',
      date_options: {},
      date_options_day: {
        shortcuts: [{
          text: '最近7天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近30天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近90天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 89)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近120天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 119)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      date_options_month: {
        shortcuts: [{
          text: '最近3个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 2)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近6个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 5)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近9个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 8)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近12个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 11)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {},
  created() {
    this.stat()
  },
  mounted() {},
  methods: {
    stat() {
      this.loading = true
      stat({
        type: this.date_type,
        date: this.date_range
      }).then(res => {
        this.date_type = res.data.number.type
        this.date_range = res.data.number.date
        this.dateEchart(res.data.number, 'numberEchart')
        this.dateOptions()
        this.loading = false
      }).catch(() => {
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
        this.date_format = 'yyyy-MM-dd'
        this.date_options = this.date_options_day
      } else if (type === 'month') {
        this.date_ptype = 'monthrange'
        this.date_format = 'yyyy-MM'
        this.date_options = this.date_options_month
      }
    },
    dateChange() {
      this.stat()
    },
    dateEchart(data, id) {
      var echart = echarts.init(document.getElementById(id))
      var option = {
        title: {
          text: '会员',
          textStyle: { fontSize: 12 }
        },
        legend: {
          top: '20px',
          data: data.legend,
          selected: { '会员总数': false }
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

<style scoped>

</style>
