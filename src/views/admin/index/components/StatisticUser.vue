<template>
  <div :style="{height:height+'px'}">
    <el-card v-loading="loadNum" class="box-card">
      <el-row :gutter="10">
        <el-col :sm="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>管理员</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12">
                  <i class="el-icon-user icon" />
                </el-col>
                <el-col :span="12" title="总数">
                  {{ number.total }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>今天</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12" title="新增">
                  + {{ number.today }}
                </el-col>
                <el-col :span="12" title="活跃">
                  ~ {{ active.today }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>昨天</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12" title="新增">
                  + {{ number.yesterday }}
                </el-col>
                <el-col :span="12" title="活跃">
                  ~ {{ active.yesterday }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>本周</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12" title="新增">
                  + {{ number.yesterday }}
                </el-col>
                <el-col :span="12" title="活跃">
                  ~ {{ active.thisweek }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="3">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>上周</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12" title="新增">
                  + {{ number.yesterday }}
                </el-col>
                <el-col :span="12" title="活跃">
                  ~ {{ active.lastweek }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>本月</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12" title="新增">
                  + {{ number.yesterday }}
                </el-col>
                <el-col :span="12" title="活跃">
                  ~ {{ active.thismonth }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>上月</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12" title="新增">
                  + {{ number.yesterday }}
                </el-col>
                <el-col :span="12" title="活跃">
                  ~ {{ active.lastmonth }}
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
var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
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
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增', '活跃']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
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
            name: '新增',
            type: 'line',
            smooth: true,
            data: date_new.y_data
          },
          {
            name: '活跃',
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
.icon {
  font-size: 25px;
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
