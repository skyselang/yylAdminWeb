<template>
  <div style="margin-bottom:15px">
    <el-card v-loading="loading" style="text-align:center">
      <el-row>
        <el-col>
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="echartIndexMemberChange()"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div id="echartIndexMember" style="height:450px" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
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

import { member } from '@/api/index'

export default {
  name: 'IndexMember',
  components: { },
  data() {
    return {
      name: '会员统计',
      loading: false,
      date: []
    }
  },
  computed: {},
  created() {
    this.member()
  },
  mounted() {},
  methods: {
    member() {
      this.loading = true
      member().then(res => {
        this.date = res.data.date
        this.echartIndexMember(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    echartIndexMemberChange() {
      this.loading = true
      member({
        date: this.date
      }).then(res => {
        this.echartIndexMember(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    echartIndexMember(data) {
      var echart = echarts.init(document.getElementById('echartIndexMember'))
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增会员', '活跃会员', '会员总数'],
          selected: { '会员总数': false },
          top: 15
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
    }
  }
}
</script>

<style scoped>
</style>
