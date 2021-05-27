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
            @change="echartDateChange()"
          />
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :sm="24">
          <div id="echartDate" :style="{height:height-100+'px'}" />
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
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
          <div id="echartFieldLine" :style="{height:height+'px'}" />
        </el-col>
      </el-row>
      <el-divider />
      <el-row v-loading="loadField" :gutter="0">
        <el-col :sm="24">
          <div id="echartFieldPie" :style="{height:height+'px'}" />
        </el-col>
      </el-row>
    </el-card>
    <back-to-top transition-name="fade" />
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
import BackToTop from '@/components/BackToTop'
import { stat } from '@/api/member-log'

export default {
  name: 'MemberLogsta',
  components: { BackToTop },
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
        x_data: [],
        y_data: [],
        date: []
      },
      field: {
        x_data: [],
        y_data: [],
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
          value: 'member',
          label: '会员'
        }
      ],
      fieldValue: 'member',
      fieldLabel: '会员',
      cardBodyStyle: {
        padding: '10px 0px 0px 0px'
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.stat()
  },
  methods: {
    stat() {
      this.loadNum = true
      stat().then(res => {
        this.num = res.data.num
        this.date = res.data.date
        this.field = res.data.field
        this.echartDate(res.data.date)
        this.echartFieldLine(res.data.field)
        this.echartFieldPie(res.data.field)
        this.loadNum = false
      }).catch(() => {
        this.loadNum = false
      })
    },
    echartDateChange() {
      this.loadDate = true
      stat({
        type: 'date', date: this.date.date
      }).then(res => {
        this.echartDate(res.data.date)
        this.loadDate = false
      }).catch(() => {
        this.loadDate = false
      })
    },
    echartFieldChange(value) {
      this.loadField = true
      stat({
        type: 'field',
        date: this.field.date,
        field: this.fieldValue
      }).then(res => {
        this.echartFieldLine(res.data.field)
        this.echartFieldPie(res.data.field)
        this.loadField = false
      }).catch(() => {
        this.loadField = false
      })
    },
    echartDate(data) {
      var echart = echarts.init(document.getElementById('echartDate'))
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
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.x_data
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'line',
            smooth: true,
            data: data.y_data
          }
        ]
      }
      echart.setOption(option)
    },
    echartFieldLine(data) {
      var echart = echarts.init(document.getElementById('echartFieldLine'))
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
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data.x_data
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
            data: data.y_data
          }
        ]
      }
      echart.setOption(option)
    },
    echartFieldPie(data) {
      var echart = echarts.init(document.getElementById('echartFieldPie'))
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
            data: data.p_data,
            emphasis: {
              Style: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
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
