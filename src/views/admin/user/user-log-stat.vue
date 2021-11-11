<template>
  <div class="app-container dialog-body" :style="{height:height+120+'px'}">
    <el-card v-loading="loadNum" class="box-card">
      <el-row :gutter="10">
        <el-col :sm="4">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>总计</span>
            </div>
            <div class="text color-tot">
              {{ num.total }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>今天</span>
            </div>
            <div class="text">
              {{ num.today }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>昨天</span>
            </div>
            <div class="text">
              {{ num.yesterday }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>本周</span>
            </div>
            <div class="text">
              {{ num.thisweek }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>上周</span>
            </div>
            <div class="text">
              {{ num.lastweek }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="4">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>本月</span>
            </div>
            <div class="text">
              {{ num.thismonth }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="4">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>上月</span>
            </div>
            <div class="text">
              {{ num.lastmonth }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-loading="loadDate" class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24">
          <el-date-picker
            v-model="date.date"
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="max-width:280px"
            @change="echartUserDateChange()"
          />
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :sm="24">
          <div id="echartUserDate" :style="{height:height-100+'px'}" />
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" :body-style="cardBodyStyle">
      <el-row :gutter="0">
        <el-col :sm="24">
          <el-date-picker
            v-model="field.date"
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="max-width:280px"
            @change="echartFieldChange()"
          />
          <el-select v-model="fieldValue" placeholder="请选择" @change="echartFieldChange()">
            <el-option v-for="item in fieldType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
      </el-row>
      <el-divider />
      <el-row v-loading="loadField" :gutter="0">
        <el-col :sm="24">
          <div id="echartUserLine" :style="{height:height+'px'}" />
        </el-col>
      </el-row>
      <el-divider />
      <el-row v-loading="loadField" :gutter="0">
        <el-col :sm="24">
          <div id="echartUserPie" :style="{height:height+'px'}" />
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
import { LineChart, BarChart, PieChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { LegendComponent, TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([LegendComponent, TitleComponent, TooltipComponent, GridComponent, LineChart, BarChart, PieChart, CanvasRenderer])

import screenHeight from '@/utils/screen-height'
import { stat } from '@/api/admin/user-log'

export default {
  name: 'AdminUserLogStat',
  components: { },
  data() {
    return {
      height: 600,
      loadNum: false,
      loadDate: false,
      loadField: false,
      num: {
        total: '--',
        today: '--',
        yesterday: '--',
        thisweek: '--',
        lastweek: '--',
        thismonth: '--',
        lastmonth: '--'
      },
      date: {
        x: [],
        s: [],
        date: []
      },
      field: {
        x: [],
        s: [],
        date: []
      },
      fieldType: [
        {
          value: 'country',
          label: '国家'
        },
        {
          value: 'province',
          label: '省份'
        },
        {
          value: 'city',
          label: '城市'
        },
        {
          value: 'isp',
          label: 'ISP'
        },
        {
          value: 'user',
          label: '用户'
        }
      ],
      fieldValue: 'user',
      fieldLabel: '用户',
      cardBodyStyle: {
        padding: '10px 0px 0px 0px'
      }
    }
  },
  computed: {},
  created() {
    this.height = screenHeight()
    this.stat()
  },
  mounted() {},
  methods: {
    stat() {
      this.loadNum = true
      stat().then(res => {
        this.num = res.data.num
        this.date = res.data.date
        this.field = res.data.field
        this.echartUserDate(res.data.date)
        this.echartUserLine(res.data.field)
        this.echartUserPie(res.data.field)
        this.loadNum = false
      }).catch(() => {
        this.loadNum = false
      })
    },
    echartUserDateChange() {
      this.loadDate = true
      stat({
        type: 'date',
        date: this.date.date
      }).then(res => {
        this.echartUserDate(res.data.date)
        this.loadDate = false
      }).catch(() => {
        this.loadDate = false
      })
    },
    echartFieldChange() {
      this.loadField = true
      stat({
        type: 'field',
        date: this.field.date,
        field: this.fieldValue
      }).then(res => {
        this.echartUserLine(res.data.field)
        this.echartUserPie(res.data.field)
        this.loadField = false
      }).catch(() => {
        this.loadField = false
      })
    },
    echartUserDate(data) {
      var echart = echarts.init(document.getElementById('echartUserDate'))
      var option = {
        title: {
          text: ''
        },
        color: ['#1890ff'],
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
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '',
            type: 'line',
            smooth: true,
            data: data.s,
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      echart.setOption(option)
    },
    echartUserLine(data) {
      var echart = echarts.init(document.getElementById('echartUserLine'))
      var option = {
        title: {
          text: ''
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data.x
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'bar',
            data: data.s,
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      echart.setOption(option)
    },
    echartUserPie(data) {
      var echart = echarts.init(document.getElementById('echartUserPie'))
      var option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: '3%',
          top: '20px'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: data.sp,
            itemStyle: {
              borderRadius: 8,
              normal: {
                label: {
                  show: true,
                  formatter: '{b} : {c} ({d}%)'
                },
                labelLine: { show: true }
              }
            }
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
  text-align: center;
  color: #666;
  font-size: 20px;
  line-height: 32px;
  font-weight: 700;
  margin-bottom: 10px;
}
</style>
