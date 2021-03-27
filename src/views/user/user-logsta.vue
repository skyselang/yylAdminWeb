<template>
  <div class="app-container">
    <el-card v-loading="loadNum" class="box-card">
      <el-row :gutter="10">
        <el-col :sm="4">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>总计</span>
            </div>
            <div class="text color-tot">
              {{ number.total }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>今天</span>
            </div>
            <div class="text">
              {{ number.today }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>昨天</span>
            </div>
            <div class="text">
              {{ number.yesterday }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>本周</span>
            </div>
            <div class="text">
              {{ number.thisweek }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>上周</span>
            </div>
            <div class="text">
              {{ number.lastweek }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="4">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>本月</span>
            </div>
            <div class="text">
              {{ number.thismonth }}
            </div>
          </el-card>
        </el-col>
        <el-col :sm="4">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>上月</span>
            </div>
            <div class="text">
              {{ number.lastmonth }}
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
          <div id="echartDate" :style="{height:height+'px'}" />
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24">
          <el-date-picker
            v-model="region.date"
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="max-width:280px"
            @change="echartRegionChange()"
          />
          <el-select v-model="regionValue" placeholder="请选择" @change="echartRegionChange()">
            <el-option v-for="item in regionType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
      </el-row>
      <el-divider />
      <el-row v-loading="loadRegion" :gutter="0">
        <el-col :sm="24">
          <div id="echartRegionLine" :style="{height:height+'px'}" />
        </el-col>
      </el-row>
      <el-divider />
      <el-row v-loading="loadRegion" :gutter="0">
        <el-col :sm="24">
          <div id="echartRegionPie" :style="{height:height+'px'}" />
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

import BackToTop from '@/components/BackToTop'
import { userLogSta } from '@/api/user'

export default {
  name: 'UserLogsta',
  components: { BackToTop },
  data() {
    return {
      height: 600,
      loadNum: false,
      loadDate: false,
      loadRegion: false,
      number: {
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
      region: {
        x_data: [],
        y_data: [],
        date: []
      },
      regionType: [
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
        }
      ],
      regionValue: 'city',
      regionLabel: '城市',
      cardBodyStyle: {
        padding: '10px 0px 0px 0px'
      }
    }
  },
  computed: {},
  created() {
    this.userLogSta()
  },
  mounted() {},
  methods: {
    userLogSta() {
      this.loadNum = true
      userLogSta().then(res => {
        this.number = res.data.number
        this.date = res.data.date
        this.region = res.data.region
        this.echartDate(res.data.date)
        this.echartRegionLine(res.data.region)
        this.echartRegionPie(res.data.region)
        this.loadNum = false
      }).catch(() => {
        this.loadNum = false
      })
    },
    echartDateChange() {
      this.loadDate = true
      userLogSta({
        type: 'date', date: this.date.date
      }).then(res => {
        this.echartDate(res.data.date)
        this.loadDate = false
      }).catch(() => {
        this.loadDate = false
      })
    },
    echartRegionChange(value) {
      this.loadRegion = true
      userLogSta({
        type: 'region',
        date: this.region.date,
        region: this.regionValue
      }).then(res => {
        this.echartRegionLine(res.data.region)
        this.echartRegionPie(res.data.region)
        this.loadRegion = false
      }).catch(() => {
        this.loadRegion = false
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
    echartRegionLine(data) {
      var echart = echarts.init(document.getElementById('echartRegionLine'))
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
            boundaryGap: false,
            data: data.x_data,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '60%',
            data: data.y_data
          }
        ]
      }
      echart.setOption(option)
    },
    echartRegionPie(data) {
      var echart = echarts.init(document.getElementById('echartRegionPie'))
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
