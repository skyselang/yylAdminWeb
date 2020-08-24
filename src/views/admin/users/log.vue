<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input v-model="logQuery.menu_url" class="filter-item" style="width: 280px;" placeholder="菜单链接" clearable />
      <el-date-picker v-model="logQuery.create_time" type="daterange" style="width: 240px;top: -4px;" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
      <el-button class="filter-item" type="primary" @click="logSearch">
        查询
      </el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="logRefresh">
        刷新
      </el-button>
    </div>
    <!-- 日志 -->
    <el-table v-loading="loading" :data="logData" :height="height" style="width: 100%" border @sort-change="logSort">
      <el-table-column prop="admin_log_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="menu_url" label="菜单链接" min-width="220" />
      <el-table-column prop="menu_name" label="菜单名称" min-width="120" />
      <el-table-column prop="request_method" label="请求方式 " min-width="110" sortable="custom" />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" sortable="custom" />
      <el-table-column prop="request_region" label="请求地区" min-width="150" />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" />
      <el-table-column prop="create_time" label="请求时间" min-width="160" sortable="custom" />
    </el-table>
    <!-- 分页 -->
    <pagination v-show="logCount > 0" :total="logCount" :page.sync="logQuery.page" :limit.sync="logQuery.limit" @pagination="usersLogList" />
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { getAdminUserId } from '@/utils/auth'
import { usersLog } from '@/api/admin'

export default {
  name: 'Log',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: true,
      logData: [],
      logCount: 0,
      logQuery: {
        admin_user_id: getAdminUserId(),
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.usersLogList()
  },
  methods: {
    usersLogList() {
      this.loading = true
      usersLog(this.logQuery)
        .then(res => {
          this.logData = res.data.list
          this.logCount = res.data.count
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    logSort(sort) {
      this.logQuery.order_field = sort.prop
      this.logQuery.order_type = ''
      if (sort.order === 'ascending') {
        this.logQuery.order_type = 'asc'
        this.usersLogList()
      }
      if (sort.order === 'descending') {
        this.logQuery.order_type = 'desc'
        this.usersLogList()
      }
    },
    logSearch() {
      this.logQuery.page = 1
      this.usersLogList()
    },
    logRefresh() {
      this.logQuery = { admin_user_id: getAdminUserId(), page: 1, limit: 10 }
      this.usersLogList()
    }
  }
}
</script>
