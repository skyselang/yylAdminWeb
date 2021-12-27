<template>
  <div>
    <!-- 查询 -->
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="ya-search-field" placeholder="搜索字段">
            <el-option value="menu_url" label="菜单链接" />
            <el-option value="menu_name" label="菜单名称" />
            <el-option value="request_ip" label="请求IP" />
            <el-option value="request_region" label="请求地区" />
            <el-option value="request_isp" label="请求ISP" />
            <el-option value="admin_user_log_id" label="ID" />
          </el-select>
          <el-input v-model="query.search_value" class="ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="ya-search-field" placeholder="时间字段">
            <el-option value="create_time" label="请求时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="ya-date-value"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-select v-model="query.log_type" class="ya-search-field" placeholder="日志类型" clearable>
            <el-option :value="1" label="登录日志" />
            <el-option :value="2" label="操作日志" />
          </el-select>
          <el-button type="primary" @click="search()">查询</el-button>
          <el-button @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="data" :height="height" @sort-change="sort">
      <el-table-column prop="admin_user_log_id" label="ID" min-width="100" sortable="custom" />
      <el-table-column prop="menu_url" label="菜单链接" min-width="250" show-overflow-tooltip />
      <el-table-column prop="menu_name" label="菜单名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="request_method" label="请求方式 " min-width="110" />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" />
      <el-table-column prop="request_region" label="请求地区" min-width="160" show-overflow-tooltip />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" />
      <el-table-column prop="create_time" label="请求时间" min-width="160" sortable="custom" />
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
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
      name: '我的日志',
      height: 680,
      loading: true,
      query: {
        page: 1,
        limit: 15,
        search_field: 'menu_url',
        date_field: 'create_time'
      },
      data: [],
      count: 0
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
  },
  methods: {
    // 列表
    list() {
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
      this.list()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.list()
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.prop
      this.query.sort_value = ''
      if (sort.order === 'ascending') {
        this.query.sort_value = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_value = 'desc'
        this.list()
      }
    }
  }
}
</script>
