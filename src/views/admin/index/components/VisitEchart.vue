<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="display:block;text-align:center;color:#666;font-size:20px;font-weight:700">yylAdmin：{{ visitData.count.total }}</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>今天</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12">
                  <svg-icon icon-class="visitDays" class-name="card-panel-icon" style="font-size:48px" />
                </el-col>
                <el-col :span="12">
                  {{ visitData.count.today }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>昨天</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12">
                  <svg-icon icon-class="visitDays" class-name="card-panel-icon" style="font-size:48px" />
                </el-col>
                <el-col :span="12">
                  {{ visitData.count.yesterday }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>本周</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12">
                  <svg-icon icon-class="visitDays" class-name="card-panel-icon" style="font-size:48px" />
                </el-col>
                <el-col :span="12">
                  {{ visitData.count.thisweek }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>上周</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12">
                  <svg-icon icon-class="visitDays" class-name="card-panel-icon" style="font-size:48px" />
                </el-col>
                <el-col :span="12">
                  {{ visitData.count.lastweek }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>本月</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12">
                  <svg-icon icon-class="visitDays" class-name="card-panel-icon" style="font-size:48px" />
                </el-col>
                <el-col :span="12">
                  {{ visitData.count.thismonth }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>上月</span>
            </div>
            <div class="text item">
              <el-row :gutter="0">
                <el-col :span="12">
                  <svg-icon icon-class="visitDays" class-name="card-panel-icon" style="font-size:48px" />
                </el-col>
                <el-col :span="12">
                  {{ visitData.count.lastmonth }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card">
      <el-row :gutter="0">
        <div id="visitDateEchart" style="width:100%;height:400px" />
      </el-row>
    </el-card>

    <el-card class="box-card">
      <el-row :gutter="0">
        <div id="visitCityEchart" style="width:100%;height:400px" />
      </el-row>
    </el-card>

    <el-card class="box-card">
      <el-row :gutter="0">
        <div id="visitIspEchart" style="width:100%;height:400px" />
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { visit } from '@/api/admin'
import echarts from 'echarts'

export default {
  name: 'VisitEchart',
  components: {},
  data() {
    return {
      visitData: {
        count: {
          total: '--',
          today: '--',
          yesterday: '--',
          thisweek: '--',
          lastweek: '--',
          thismonth: '--',
          lastmonth: '--'
        },
        date: {
          date: [],
          num: []
        },
        city: {
          city: [],
          num: []
        },
        isp: {
          isp: [],
          num: []
        }
      }
    }
  },
  created() {
    this.visit()
  },
  mounted() {},
  methods: {
    visit() {
      visit()
        .then(res => {
          this.visitData = res.data
          this.visitDate()
          this.visitCity()
          this.visitIsp()
        })
        .catch(() => {})
    },
    visitDate() {
      var visitDateEchart = echarts.init(
        document.getElementById('visitDateEchart')
      )
      var option = {
        title: {
          text: 'DATE',
          left: 'center'
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
          data: this.visitData.date.date
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.visitData.date.num,
            type: 'line',
            areaStyle: {}
          }
        ]
      }
      visitDateEchart.setOption(option)
    },
    visitCity() {
      var visitCityEchart = echarts.init(
        document.getElementById('visitCityEchart')
      )
      var option = {
        title: {
          text: 'CITY',
          left: 'center'
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
            data: this.visitData.city.city,
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
            data: this.visitData.city.num
          }
        ]
      }
      visitCityEchart.setOption(option)
    },
    visitIsp() {
      var visitIspEchart = echarts.init(
        document.getElementById('visitIspEchart')
      )
      var option = {
        title: {
          text: 'ISP',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.visitData.isp.isp
        },
        series: [
          {
            name: 'ISP',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.visitData.isp.num,
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
      visitIspEchart.setOption(option)
    }
  }
}
</script>

<style scoped>
.box-card .text {
  color: #666;
  font-size: 20px;
  line-height: 48px;
  font-weight: 700;
}
</style>
