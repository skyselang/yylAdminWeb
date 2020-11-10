<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24" :md="8">
          <el-date-picker v-model="data.date" type="daterange" range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="max-width:280px" @change="dateChange" />
        </el-col>
        <el-col :sm="24" :md="16">
          <el-select v-model="regionValue" placeholder="请选择" @change="regionChange">
            <el-option v-for="item in regionType" :key="item.value" :label="item.label" :value="item.value" />
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
import { logStatistic } from '@/api/admin'
import echarts from 'echarts'

export default {
  name: 'LogStaRegion',
  components: {},
  data() {
    return {
      height: 680,
      type: 'region',
      data: {
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
  created() {
    this.height = screenHeight()
    this.logStatistic()
  },
  mounted() {},
  methods: {
    logStatistic() {
      logStatistic({
        type: this.type,
        date: this.data.date,
        region: this.regionValue
      })
        .then(res => {
          this.data = res.data
          this.echartLine(res.data)
          this.echartPie(res.data)
        })
        .catch(() => {})
    },
    dateChange() {
      this.logStatistic()
    },
    regionChange(value) {
      this.logStatistic()
    },
    echartLine(data) {
      var echart = echarts.init(document.getElementById('echartLine'))
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
    echartPie(data) {
      var echart = echarts.init(document.getElementById('echartPie'))
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
          top: '20px',
          data: data.x_data
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
