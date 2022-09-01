<template>
  <div class="app-container">
    <div class="dialog-body" :style="{height:height+'px'}">
      <el-card v-loading="loading" class="box-card">
        <el-row :gutter="6">
          <el-col v-for="(item, index) in count" :key="index" :span="3">
            <el-card class="box-card" :body-style="{padding: '10px 0px 0px 0px'}">
              <div slot="header" class="clearfix">
                <span>{{ item.name }}</span>
              </div>
              <div class="text">
                <el-row style="padding-bottom:10px">
                  <el-col :title="item.title">
                    {{ item.count }}
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <el-card v-for="(item, index) in echart_num" :key="index" v-loading="loading" class="box-card ya-margin-top">
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
            <div :id="echart_id+index" :style="{height:height-300+'px'}" />
          </el-col>
        </el-row>
      </el-card>
      <el-card v-loading="loading" class="box-card ya-margin-top">
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
            <el-select v-model="fieldValue" class="filter-item" placeholder="请选择" @change="fieldChange">
              <el-option v-for="item in fieldType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col>
            <div :id="echart_id+'field'" :style="{height:height-300+'px'}" />
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { stat } from '@/api/admin/user-log'

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

export default {
  name: 'AdminUserLogStat',
  components: { },
  data() {
    return {
      name: '用户日志统计',
      height: 600,
      loading: false,
      count: [],
      echart_id: 'echartid',
      echart_num: 1,
      echart_data: [],
      date_type: 'day',
      date_range: [],
      date_options: {},
      date_ptype: 'monthrange',
      date_format: 'yyyy-MM',
      picker_options_day: {
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
      picker_options_month: {
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
      },
      fieldType: [
        {
          value: 'request_country',
          label: '国家'
        },
        {
          value: 'request_province',
          label: '省份'
        },
        {
          value: 'request_city',
          label: '城市'
        },
        {
          value: 'request_isp',
          label: 'ISP'
        },
        {
          value: 'admin_user_id',
          label: '用户'
        }
      ],
      fieldValue: 'request_province'
    }
  },
  computed: {},
  watch: {
    echart_data() {
      this.$nextTick(() => {
        this.setEchart()
      })
    }
  },
  created() {
    this.height = screenHeight(120)
    this.stat()
  },
  mounted() {},
  methods: {
    stat() {
      this.loading = true
      stat({
        type: this.date_type,
        date: this.date_range,
        field: this.fieldValue
      }).then(res => {
        this.count = res.data.count
        this.echart_data = res.data.echart
        this.echart_num = res.data.echart.length
        this.initEchart(res.data.field, this.echart_id + 'field')
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
        this.date_options = this.picker_options_day
      } else if (type === 'month') {
        this.date_ptype = 'monthrange'
        this.date_format = 'yyyy-MM'
        this.date_options = this.picker_options_month
      }
    },
    dateChange() {
      this.stat()
    },
    fieldChange() {
      this.stat()
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
          data: data.legend
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

<style scoped>
.box-card {
  text-align: center;
}
.box-card .text {
  font-size: 20px;
  line-height: 32px;
  font-weight: 700;
  text-align: center;
}
</style>
