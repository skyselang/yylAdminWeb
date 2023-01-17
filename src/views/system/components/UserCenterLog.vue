<template>
  <div>
    <!-- 查询 -->
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option :value="idkey" label="ID" />
            <el-option value="request_ip" label="请求IP" />
            <el-option value="request_region" label="请求地区" />
            <el-option value="request_isp" label="请求ISP" />
            <el-option value="log_type" label="日志类型" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-select v-if="query.search_field=='log_type'" v-model="query.log_type" class="filter-item ya-search-value" placeholder="日志类型" clearable>
            <el-option :value="1" label="登录日志" />
            <el-option :value="2" label="操作日志" />
          </el-select>
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="查询内容" clearable />
          <el-date-picker v-model="query.date_value" type="daterange" class="filter-item ya-date-value" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
          <el-button class="filter-item" type="primary" title="查询/刷新" @click="search()">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" title="重置" @click="refresh()" />
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" @sort-change="sort">
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="menu_id" label="菜单ID" min-width="100" />
      <el-table-column prop="menu_name" label="菜单名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="menu_url" label="菜单链接" min-width="250" show-overflow-tooltip />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" />
      <el-table-column prop="request_region" label="请求地区" min-width="160" show-overflow-tooltip />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" show-overflow-tooltip />
      <el-table-column prop="response_code" label="返回码" min-width="80" show-overflow-tooltip />
      <el-table-column prop="response_msg" label="返回描述" min-width="115" show-overflow-tooltip />
      <el-table-column prop="create_time" label="请求时间" min-width="155" sortable="custom" />
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count>0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { log } from '@/api/system/user-center'

export default {
  name: 'SystemUserCenterLog',
  components: { Pagination },
  data() {
    return {
      name: '我的日志',
      height: 680,
      loading: true,
      idkey: 'log_id',
      exps: [],
      query: {
        page: 1,
        limit: 12,
        search_field: 'request_region',
        date_field: 'create_time'
      },
      data: [],
      count: 0
    }
  },
  created() {
    this.height = screenHeight(280)
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      log(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.exps = res.data.exps
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
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.$refs['table'].clearSort()
      this.query.limit = limit
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
