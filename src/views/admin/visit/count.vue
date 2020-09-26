<template>
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
                  {{ data.total }}
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
                  {{ data.today }}
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
                  {{ data.yesterday }}
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
                  {{ data.thisweek }}
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
                  {{ data.lastweek }}
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
                  {{ data.thismonth }}
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
                  {{ data.lastmonth }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { visitCount } from '@/api/admin'

export default {
  name: 'Count',
  components: {},
  data() {
    return {
      data: {
        total: '--',
        today: '--',
        yesterday: '--',
        thisweek: '--',
        lastweek: '--',
        thismonth: '--',
        lastmonth: '--'
      }
    }
  },
  created() {
    this.visit()
  },
  mounted() {},
  methods: {
    visit() {
      visitCount()
        .then(res => {
          this.data = res.data
        })
        .catch(() => {})
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
