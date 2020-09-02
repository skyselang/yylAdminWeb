<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24" :md="8">
          <el-date-picker v-model="data.date" type="daterange" range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="max-width:280px" @change="dateChange" />
        </el-col>
        <el-col :sm="24" :md="16">
          <el-select v-model="statsValue" placeholder="请选择" @change="regionChange">
            <el-option v-for="item in statsType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
      </el-row>
      <el-divider />
      <el-row :gutter="0">
        <el-col :sm="24">
          <div id="echartLine" :style="{height:height+'px'}" />
        </el-col>
      </el-row>
      <el-divider />
      <el-row :gutter="0">
        <el-col :sm="24">
          <div id="echartPie" :style="{height:height+'px'}" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { visitStats } from '@/api/admin'
import echarts from 'echarts'

export default {
  name: 'Stats',
  components: {},
  data() {
    return {
      height: 680,
      data: {
        x_data: [],
        y_data: [],
        date: []
      },
      statsType: [
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
      statsValue: 'city',
      statsLabel: '城市'
    }
  },
  created() {
    this.height = screenHeight()
    this.visit()
  },
  mounted() {},
  methods: {
    visit() {
      visitStats({
        date: this.data.date,
        stats: this.statsValue
      })
        .then(res => {
          this.data = res.data
          this.setStatsLabel()
          this.echartLine(res.data)
          this.echartPie(res.data)
        })
        .catch(() => {})
    },
    dateChange() {
      this.visit()
    },
    regionChange(value) {
      this.visit()
    },
    setStatsLabel() {
      var statsLabel
      for (let index = 0; index < this.statsType.length; index++) {
        if (this.statsValue === this.statsType[index]['value']) {
          statsLabel = this.statsType[index]['label']
        }
      }
      this.statsLabel = statsLabel
    },
    echartLine(data) {
      var echart = echarts.init(document.getElementById('echartLine'))
      var option = {
        title: {
          text: this.statsLabel,
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
    echartPie(data) {
      var echart = echarts.init(document.getElementById('echartPie'))
      var option = {
        title: {
          text: this.statsLabel,
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
          top: '20px',
          data: data.x_data
        },
        series: [
          {
            name: this.statsLabel,
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
