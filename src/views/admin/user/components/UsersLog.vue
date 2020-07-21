<template>
  <el-card class="box-card">
    <!-- search -->
    <div class="filter-container">
      <el-input v-model="tableQuery.menu_url" placeholder="菜单链接" style="width: 280px;" class="filter-item" clearable />
      <el-date-picker v-model="tableQuery.create_time" type="daterange" style="width: 240px;top: -4px;" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
      <el-button class="filter-item" type="primary" @click="tableSearch">
        查询
      </el-button>
      <el-button class="filter-item" style="float:right;" type="primary" @click="tableReset">
        刷新
      </el-button>
    </div>
    <!-- table -->
    <el-table v-loading="loading" :data="tableData" border style="width: 100%" @sort-change="tableSort">
      <el-table-column prop="admin_log_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="admin_user_id" label="用户ID" min-width="80" />
      <el-table-column prop="username" label="用户账号" min-width="110" />
      <el-table-column prop="nickname" label="用户昵称" min-width="110" />
      <el-table-column prop="menu_url" label="菜单链接" min-width="220" />
      <el-table-column prop="menu_name" label="菜单名称" min-width="120" />
      <el-table-column prop="request_method" label="请求方式 " min-width="110" sortable="custom" />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" sortable="custom" />
      <el-table-column prop="request_region" label="请求地区" min-width="150" />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" />
      <el-table-column prop="create_time" label="请求时间" min-width="160" sortable="custom" />
    </el-table>
    <!-- page -->
    <pagination v-show="tableCount > 0" :total="tableCount" :page.sync="tableQuery.page" :limit.sync="tableQuery.limit" @pagination="tableList" />
  </el-card>
</template>

<script>
import { usersLog } from '@/api/admin'
import Pagination from '@/components/Pagination'
import { getAdminUserId } from '@/utils/auth'

export default {
  name: 'UsersLog',
  components: { Pagination },
  data() {
    return {
      loading: true,
      loadingTime: 0,
      tableData: [],
      tableCount: 0,
      tableQuery: {
        admin_user_id: getAdminUserId(),
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.tableList()
  },
  methods: {
    loadingOpen() {
      this.loading = true
    },
    loadingClose() {
      const that = this
      setTimeout(function() {
        that.loading = false
      }, that.loadingTime)
    },
    message(msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    tableList() {
      this.loadingOpen()
      usersLog(this.tableQuery)
        .then(res => {
          this.tableData = res.data.list
          this.tableCount = res.data.count
          this.loadingClose()
        })
        .catch(() => {
          this.loadingClose()
        })
    },
    tableSort(sort) {
      this.tableQuery.order_field = sort.prop
      this.tableQuery.order_type = ''
      if (sort.order === 'ascending') {
        this.tableQuery.order_type = 'asc'
        this.tableList()
      }
      if (sort.order === 'descending') {
        this.tableQuery.order_type = 'desc'
        this.tableList()
      }
    },
    tableSearch() {
      this.tableQuery.page = 1
      this.tableList()
    },
    tableReset() {
      this.tableQuery = { admin_user_id: getAdminUserId(), page: 1, limit: 10 }
      this.tableList()
    }
  }
}
</script>
