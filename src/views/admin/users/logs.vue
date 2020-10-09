<template>
  <div class="app-container">
    <!-- 日志查询 -->
    <div class="filter-container">
      <el-select v-model="logQuery.type" class="filter-item" placeholder="日志类型" style="width:110px;" clearable>
        <el-option key="1" label="登录日志" value="1" />
        <el-option key="2" label="操作日志" value="2" />
      </el-select>
      <el-input v-model="logQuery.request_keyword" class="filter-item" style="width: 155px;" placeholder="请求IP/地区/ISP" clearable />
      <el-input v-model="logQuery.menu_keyword" class="filter-item" style="width: 280px;" placeholder="菜单链接/名称" clearable />
      <el-date-picker v-model="logQuery.create_time" type="daterange" style="width: 240px;top: -4px;" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
      <el-button class="filter-item" type="primary" @click="logSearch">查询</el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="logRefresh">刷新</el-button>
    </div>
    <!-- 日志列表 -->
    <el-table v-loading="loading" :data="logData" :height="height" style="width: 100%" border @sort-change="logSort">
      <el-table-column prop="admin_log_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="menu_url" label="菜单链接" min-width="235" />
      <el-table-column prop="menu_name" label="菜单名称" min-width="130" />
      <el-table-column prop="request_method" label="请求方式 " min-width="110" sortable="custom" />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" sortable="custom" />
      <el-table-column prop="request_region" label="请求地区" min-width="150" />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" />
      <el-table-column prop="create_time" label="请求时间" min-width="160" sortable="custom" />
    </el-table>
    <!-- 日志分页 -->
    <pagination v-show="logCount > 0" :total="logCount" :page.sync="logQuery.page" :limit.sync="logQuery.limit" @pagination="usersLogList" />
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { getAdminUserId } from '@/utils/auth'
import { usersLog } from '@/api/admin'

export default {
  name: 'Logs',
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
        limit: 13,
        type: ''
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.usersLogList()
  },
  methods: {
    // 用户列表
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
    // 用户查询
    logSearch() {
      this.logQuery.page = 1
      this.usersLogList()
    },
    // 用户刷新
    logRefresh() {
      this.logQuery = { admin_user_id: getAdminUserId(), page: 1, limit: 13 }
      this.usersLogList()
    },
    // 用户排序
    logSort(sort) {
      this.logQuery.sort_field = sort.prop
      this.logQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.logQuery.sort_type = 'asc'
        this.usersLogList()
      }
      if (sort.order === 'descending') {
        this.logQuery.sort_type = 'desc'
        this.usersLogList()
      }
    }
  }
}
</script>
