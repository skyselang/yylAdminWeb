<template>
  <div>
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="24">
          <el-select v-model="query.log_type" class="filter-item" placeholder="日志类型" style="width:110px;" clearable>
            <el-option :value="1" label="登录日志" />
            <el-option :value="2" label="操作日志" />
          </el-select>
          <el-input v-model="query.request_keyword" class="filter-item" style="width: 155px;" placeholder="请求IP/地区/ISP" clearable />
          <el-input v-model="query.menu_keyword" class="filter-item" style="width: 250px;" placeholder="菜单链接/名称" clearable />
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="filter-item"
            style="width: 240px;"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="data" :height="height-50" style="width: 100%" @sort-change="sort">
      <el-table-column prop="admin_user_log_id" label="日志ID" min-width="100" sortable="custom" />
      <el-table-column prop="menu_url" label="菜单链接" min-width="250" />
      <el-table-column prop="menu_name" label="菜单名称" min-width="150" />
      <el-table-column prop="request_method" label="请求方式 " min-width="110" />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" />
      <el-table-column prop="request_region" label="请求地区" min-width="160" />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" />
      <el-table-column prop="create_time" label="请求时间" min-width="160" sortable="custom" />
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="log" />
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { log } from '@/api/admin/user-center'

export default {
  name: 'UserCenterLog',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: true,
      data: [],
      count: 0,
      query: {
        page: 1,
        limit: 15
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.log()
  },
  methods: {
    // 列表
    log() {
      this.loading = true
      log(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    search() {
      this.query.page = 1
      this.log()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.log()
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.prop
      this.query.sort_value = ''
      if (sort.order === 'ascending') {
        this.query.sort_value = 'asc'
        this.log()
      }
      if (sort.order === 'descending') {
        this.query.sort_value = 'desc'
        this.log()
      }
    }
  }
}
</script>
