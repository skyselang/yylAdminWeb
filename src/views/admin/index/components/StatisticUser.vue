<template>
  <div>
    <el-card v-loading="loadNum" class="box-card">
      <el-row :gutter="10">
        <el-col :sm="4">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>用户</span>
            </div>
            <div class="text">
              <el-row :gutter="0">
                <el-col :span="24" class="color-tot" title="总数">
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
              <el-row :gutter="0">
                <el-col :span="12" class="color-new" title="新增用户">
                  {{ number.today }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃用户">
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
              <el-row :gutter="0">
                <el-col :span="12" class="color-new" title="新增用户">
                  {{ number.yesterday }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃用户">
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
              <el-row :gutter="0">
                <el-col :span="12" class="color-new" title="新增用户">
                  {{ number.yesterday }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃用户">
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
              <el-row :gutter="0">
                <el-col :span="12" class="color-new" title="新增用户">
                  {{ number.yesterday }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃用户">
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
              <el-row :gutter="0">
                <el-col :span="12" class="color-new" title="新增用户">
                  {{ number.yesterday }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃用户">
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
              <el-row :gutter="0">
                <el-col :span="12" class="color-new" title="新增用户">
                  {{ number.yesterday }}
                </el-col>
                <el-col :span="12" class="color-act" title="活跃用户">
                  {{ active.lastmonth }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-loading="loadDate" class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24">
          <el-date-picker
            v-model="date_new.date"
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
          <div id="echartDate" style="height:500px" />
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
import { LineChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { LegendComponent, TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([LegendComponent, TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer])

import screenHeight from '@/utils/screen-height'
import BackToTop from '@/components/BackToTop'
import { statisticUser } from '@/api/admin'

export default {
  name: 'StatisticUser',
  components: { BackToTop },
  data() {
    return {
      height: 680,
      loadNum: false,
      loadDate: false,
      loadRegion: false,
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
      date_new: {
        x_data: [],
        y_data: [],
        date: []
      },
      date_act: {
        x_data: [],
        y_data: [],
        date: []
      },
      region: {
        x_data: [],
        y_data: [],
        date: []
      },
      cardBodyStyle: {
        padding: '10px 0px 0px 0px'
      }
    }
  },
  computed: {},
  created() {
    this.height = screenHeight(180)
    this.statisticUser()
  },
  mounted() {},
  methods: {
    statisticUser() {
      this.loadNum = true
      statisticUser().then(res => {
        this.number = res.data.number
        this.active = res.data.active
        this.date_new = res.data.date_new
        this.date_act = res.data.date_act
        this.region = res.data.region
        this.echartDate(res.data.date_new, res.data.date_act)
        this.loadNum = false
      }).catch(() => {
        this.loadNum = false
      })
    },
    echartDateChange() {
      this.loadDate = true
      statisticUser({
        type: 'date',
        date: this.date_new.date
      }).then(res => {
        this.echartDate(res.data.date_new, res.data.date_act)
        this.loadDate = false
      }).catch(() => {
        this.loadDate = false
      })
    },
    echartDate(date_new, date_act) {
      var echart = echarts.init(document.getElementById('echartDate'))
      var option = {
        title: {
          text: ''
        },
        color: ['#1890ff', '#13ce66'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增用户', '活跃用户']
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
          data: date_new.x_data
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '新增用户',
            type: 'line',
            smooth: true,
            data: date_new.y_data
          },
          {
            name: '活跃用户',
            type: 'line',
            smooth: true,
            data: date_act.y_data
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
  color: #1890ff;
  border-right: 1px solid #e6ebf5;
}
.color-act {
  color: #13ce66;
}
</style>
