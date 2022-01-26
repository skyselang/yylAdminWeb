<template>
  <div class="app-container dialog-body" :style="{height:height+'px'}">
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="10">
        <el-col :sm="4">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>会员</span>
            </div>
            <div class="text">
              <el-row>
                <el-col class="color-tot" title="总数">
                  {{ number.total }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>今天</span>
            </div>
            <div class="text">
              <el-row>
                <el-col :span="12" class="color-new" title="新增会员">
                  {{ number.today }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃会员">
                  {{ active.today }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>昨天</span>
            </div>
            <div class="text">
              <el-row>
                <el-col :span="12" class="color-new" title="新增会员">
                  {{ number.yesterday }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃会员">
                  {{ active.yesterday }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>本周</span>
            </div>
            <div class="text">
              <el-row>
                <el-col :span="12" class="color-new" title="新增会员">
                  {{ number.yesterday }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃会员">
                  {{ active.thisweek }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>上周</span>
            </div>
            <div class="text">
              <el-row>
                <el-col :span="12" class="color-new" title="新增会员">
                  {{ number.yesterday }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃会员">
                  {{ active.lastweek }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="4">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>本月</span>
            </div>
            <div class="text">
              <el-row>
                <el-col :span="12" class="color-new" title="新增会员">
                  {{ number.yesterday }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃会员">
                  {{ active.thismonth }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="4">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>上月</span>
            </div>
            <div class="text">
              <el-row>
                <el-col :span="12" class="color-new" title="新增会员">
                  {{ number.yesterday }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃会员">
                  {{ active.lastmonth }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="echartMemberDateChange"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div id="echartMemberDate" :style="{height:height-300+'px'}" />
        </el-col>
      </el-row>
      <el-divider />
      <el-row>
        <el-col>
          <div id="echartMemberCount" :style="{height:height-300+'px'}" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
// ECharts
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core'
// 引入图表，图表后缀都为 Chart
import { LineChart } from 'echarts/charts'
// 引入组件，组件后缀都为 Component
import { TitleComponent, LegendComponent, TooltipComponent, GridComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([LineChart, TitleComponent, LegendComponent, TooltipComponent, GridComponent, CanvasRenderer])

import { stat } from '@/api/member/member'

export default {
  name: 'MemberStat',
  components: { },
  directives: { },
  data() {
    return {
      name: '会员统计',
      height: 680,
      loading: false,
      number: {
        total: '-',
        today: '-',
        yesterday: '-',
        thisweek: '-',
        lastweek: '-',
        thismonth: '-',
        lastmonth: '-'
      },
      active: {
        total: '-',
        today: '-',
        yesterday: '-',
        thisweek: '-',
        lastweek: '-',
        thismonth: '-',
        lastmonth: '-'
      },
      date: [],
      cardBodyStyle: {
        padding: '10px 0px 0px 0px'
      }
    }
  },
  computed: {},
  created() {
    this.height = screenHeight(100)
    this.stat()
  },
  mounted() {},
  methods: {
    stat() {
      this.loading = true
      stat().then(res => {
        this.number = res.data.number
        this.active = res.data.active
        this.region = res.data.region
        this.date = res.data.date.date
        this.echartMemberDate(res.data.date)
        this.echartMemberCount(res.data.count)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    echartMemberDateChange() {
      this.loading = true
      stat({
        date: this.date
      }).then(res => {
        this.echartMemberDate(res.data.date)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    echartMemberDate(data) {
      var echart = echarts.init(document.getElementById('echartMemberDate'))
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增会员', '活跃会员', '会员总数'],
          selected: { '会员总数': false }
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
          data: data.new.x
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '新增会员',
            type: 'line',
            smooth: true,
            data: data.new.s,
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '活跃会员',
            type: 'line',
            smooth: true,
            data: data.act.s,
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '会员总数',
            type: 'line',
            smooth: true,
            data: data.count.s,
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      echart.setOption(option)
    },
    echartMemberCount(data) {
      var echart = echarts.init(document.getElementById('echartMemberCount'))
      var option = {
        legend: {
          data: ['会员总数']
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
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
            name: '会员总数',
            data: data.s,
            type: 'line',
            areaStyle: {},
            label: {
              show: true,
              position: 'top'
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
  color: #666;
  font-size: 20px;
  line-height: 32px;
  font-weight: 700;
  text-align: center;
}
.el-row {
  margin-bottom: 10px;
}
.color-tot {
  color: #1890ff;
}
.color-new {
  color: #5470c6;
  border-right: 1px solid #e6ebf5;
}
.color-act {
  color: #91cc75;
}
</style>
