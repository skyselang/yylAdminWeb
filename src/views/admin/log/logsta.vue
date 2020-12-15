<template>
  <div>
    <div class="app-container">
      <el-card class="box-card">
        <el-row :gutter="10">
          <el-col :sm="24" :md="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>总计</span>
              </div>
              <div class="text item">
                <el-row :gutter="0">
                  <el-col :span="12">
                    <i class="el-icon-odometer icon" />
                  </el-col>
                  <el-col :span="12">
                    {{ number.total }}
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :sm="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>今天</span>
              </div>
              <div class="text item">
                <el-row :gutter="0">
                  <el-col :span="12">
                    <i class="el-icon-odometer icon" />
                  </el-col>
                  <el-col :span="12">
                    {{ number.today }}
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
          <el-col :sm="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>昨天</span>
              </div>
              <div class="text item">
                <el-row :gutter="0">
                  <el-col :span="12">
                    <i class="el-icon-odometer icon" />
                  </el-col>
                  <el-col :span="12">
                    {{ number.yesterday }}
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :sm="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>本周</span>
              </div>
              <div class="text item">
                <el-row :gutter="0">
                  <el-col :span="12">
                    <i class="el-icon-odometer icon" />
                  </el-col>
                  <el-col :span="12">
                    {{ number.thisweek }}
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
          <el-col :sm="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>上周</span>
              </div>
              <div class="text item">
                <el-row :gutter="0">
                  <el-col :span="12">
                    <i class="el-icon-odometer icon" />
                  </el-col>
                  <el-col :span="12">
                    {{ number.lastweek }}
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :sm="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>本月</span>
              </div>
              <div class="text item">
                <el-row :gutter="0">
                  <el-col :span="12">
                    <i class="el-icon-odometer icon" />
                  </el-col>
                  <el-col :span="12">
                    {{ number.thismonth }}
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
          <el-col :sm="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>上月</span>
              </div>
              <div class="text item">
                <el-row :gutter="0">
                  <el-col :span="12">
                    <i class="el-icon-odometer icon" />
                  </el-col>
                  <el-col :span="12">
                    {{ number.lastmonth }}
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="app-container">
      <el-card class="box-card">
        <el-row :gutter="0">
          <el-col :sm="24">
            <el-date-picker v-model="date.date" type="daterange" range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="max-width:280px" @change="echartDateChange()" />
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :sm="24">
            <div id="echartDate" :style="{height:height+'px'}" />
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="app-container">
      <el-card class="box-card">
        <el-row :gutter="0">
          <el-col :sm="24" :md="8">
            <el-date-picker v-model="region.date" type="daterange" range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="max-width:280px" @change="echartRegionChange()" />
          </el-col>
          <el-col :sm="24" :md="16">
            <el-select v-model="regionValue" placeholder="请选择" @change="echartRegionChange()">
              <el-option v-for="item in regionType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="0">
          <el-col :sm="24">
            <div id="echartRegionLine" :style="{height:height+'px'}" />
          </el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="0">
          <el-col :sm="24">
            <div id="echartRegionPie" :style="{height:height+'px'}" />
          </el-col>
        </el-row>
      </el-card>
    </div>
    <back-to-top transition-name="fade" />
  </div>
</template>

<script>
// ECharts
var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
import BackToTop from '@/components/BackToTop'
import { logStatistic } from '@/api/admin'

export default {
  name: 'Logsta',
  components: { BackToTop },
  data() {
    return {
      height: 680,
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
      regionLabel: '城市'
    }
  },
  computed: {},
  created() {
    this.logStatistic()
  },
  mounted() {},
  methods: {
    logStatistic() {
      logStatistic().then(res => {
        this.number = res.data.number
        this.date = res.data.date
        this.region = res.data.region
        this.echartDate(res.data.date)
        this.echartRegionLine(res.data.region)
        this.echartRegionPie(res.data.region)
      })
    },
    echartDateChange() {
      logStatistic({
        type: 'date', date: this.date.date
      }).then(res => {
        this.echartDate(res.data.date)
      })
    },
    echartDate(data) {
      var echart = echarts.init(document.getElementById('echartDate'))
      var option = {
        title: {
          text: '',
          left: 'center',
          textStyle: {
            color: '#666',
            fontSize: 14
          }
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
            data: data.y_data,
            type: 'line',
            areaStyle: {}
          }
        ]
      }
      echart.setOption(option)
    },
    echartRegionChange(value) {
      logStatistic({
        type: 'region',
        date: this.region.date,
        region: this.regionValue
      }).then(res => {
        this.echartRegionLine(res.data.region)
        this.echartRegionPie(res.data.region)
      })
    },
    echartRegionLine(data) {
      var echart = echarts.init(document.getElementById('echartRegionLine'))
      var option = {
        title: {
          text: '',
          left: 'center',
          textStyle: {
            color: '#666',
            fontSize: 14
          }
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
          text: '',
          left: 'center',
          textStyle: {
            color: '#666',
            fontSize: 14
          }
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
              itemStyle: {
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
.icon {
  font-size: 32px;
}
.box-card .text {
  color: #666;
  font-size: 20px;
  line-height: 32px;
  font-weight: 700;
}
.el-row {
  margin-bottom: 10px;
}
</style>
