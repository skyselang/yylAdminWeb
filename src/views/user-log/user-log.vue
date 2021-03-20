<template>
  <div class="app-container">
    <!-- 用户日志查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="22">
          <el-select v-model="userLogQuery.log_type" class="filter-item" style="width:110px;" placeholder="日志类型" clearable>
            <el-option :value="1" label="注册日志" />
            <el-option :value="2" label="登录日志" />
            <el-option :value="3" label="操作日志" />
          </el-select>
          <el-input v-model="userLogQuery.user_keyword" class="filter-item" style="width: 135px;" placeholder="用户账号/昵称" clearable />
          <el-input v-model="userLogQuery.api_keyword" class="filter-item" style="width: 235px;" placeholder="接口链接/名称" clearable />
          <el-input v-model="userLogQuery.request_keyword" class="filter-item" style="width: 155px;" placeholder="请求IP/地区/ISP" clearable />
          <el-date-picker
            v-model="userLogQuery.create_time"
            type="daterange"
            class="filter-item"
            style="width: 240px;"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="userLogSearch()">查询</el-button>
          <el-button class="filter-item" @click="userLogRefresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="2" style="text-align:right;">
          <el-button v-permission="['admin/UserLog/userLogSta']" class="filter-item" type="primary" title="用户日志统计" @click="userLogSta">统计</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 用户日志列表 -->
    <el-table v-loading="loading" :data="userLogData" :height="height" style="width: 100%" border @sort-change="userLogSort">
      <el-table-column prop="user_log_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="username" label="用户账号" min-width="110" show-overflow-tooltip />
      <el-table-column prop="nickname" label="用户昵称" min-width="110" show-overflow-tooltip />
      <el-table-column prop="api_url" label="接口链接" min-width="235" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="api_name" label="接口名称" min-width="130" show-overflow-tooltip />
      <el-table-column prop="request_method" label="请求方式 " min-width="110" sortable="custom" />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" sortable="custom" />
      <el-table-column prop="request_region" label="请求地区" min-width="150" show-overflow-tooltip />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" />
      <el-table-column prop="create_time" label="请求时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="150" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userLogDetail(row)">详情</el-button>
          <el-button size="mini" type="danger" @click="userLogDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户日志分页 -->
    <pagination v-show="userLogCount > 0" :total="userLogCount" :page.sync="userLogQuery.page" :limit.sync="userLogQuery.limit" @pagination="userLogList" />
    <!-- 用户日志详情 -->
    <el-dialog :title="userLogDialogTitle" :visible.sync="userLogDialog" top="1vh" :before-close="userLogCancel">
      <el-form ref="userLogRef" :rules="userLogRules" :model="userLogModel" label-width="100px" class="dialog-body" :style="{height:height+30+'px'}">
        <el-form-item label="用户ID" prop="user_id">
          <el-col :span="10">
            <el-input v-model="userLogModel.user_id" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">用户昵称</el-col>
          <el-col :span="10">
            <el-input v-model="userLogModel.nickname" />
          </el-col>
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="userLogModel.username" />
        </el-form-item>
        <el-form-item label="接口ID" prop="api_id">
          <el-col :span="10">
            <el-input v-model="userLogModel.api_id" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">接口名称</el-col>
          <el-col :span="10">
            <el-input v-model="userLogModel.api_name" />
          </el-col>
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="userLogModel.api_url" />
        </el-form-item>
        <el-form-item label="请求方式" prop="request_method">
          <el-col :span="10">
            <el-input v-model="userLogModel.request_method" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">请求IP</el-col>
          <el-col :span="10">
            <el-input v-model="userLogModel.request_ip" />
          </el-col>
        </el-form-item>
        <el-form-item label="请求地区" prop="request_region">
          <el-col :span="10">
            <el-input v-model="userLogModel.request_region" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">请求ISP</el-col>
          <el-col :span="10">
            <el-input v-model="userLogModel.request_isp" />
          </el-col>
        </el-form-item>
        <el-form-item label="请求时间" prop="create_time">
          <el-input v-model="userLogModel.create_time" />
        </el-form-item>
        <el-form-item label="请求参数" prop="request_param">
          <pre>{{ userLogModel.request_param }}</pre>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userLogCancel">取消</el-button>
        <el-button type="primary" @click="userLogSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { userLogList, userLogInfo, userLogDele } from '@/api/user-log'

export default {
  name: 'UserLog',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      height: 680,
      loading: false,
      userLogData: [],
      userLogCount: 0,
      userLogQuery: {
        page: 1,
        limit: 13
      },
      userLogDialog: false,
      userLogDialogTitle: '',
      userLogModel: {},
      userLogRules: {}
    }
  },
  created() {
    this.height = screenHeight()
    this.userLogList()
  },
  methods: {
    // 用户日志列表
    userLogList() {
      this.loading = true
      userLogList(this.userLogQuery).then(res => {
        this.userLogData = res.data.list
        this.userLogCount = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 用户日志查询
    userLogSearch() {
      this.userLogQuery.page = 1
      this.userLogList()
    },
    // 用户日志刷新
    userLogRefresh() {
      this.userLogQuery = this.$options.data().userLogQuery
      this.userLogList()
    },
    // 用户日志排序
    userLogSort(sort) {
      this.userLogQuery.sort_field = sort.prop
      this.userLogQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.userLogQuery.sort_type = 'asc'
        this.userLogList()
      }
      if (sort.order === 'descending') {
        this.userLogQuery.sort_type = 'desc'
        this.userLogList()
      }
    },
    // 用户日志统计
    userLogSta() {
      this.$router.push('/users/user-logsta')
    },
    // 用户日志详情
    userLogDetail(row) {
      this.loading = true
      this.userLogDialog = true
      this.userLogDialogTitle = '用户日志详情：' + row.user_log_id
      userLogInfo({
        user_log_id: row.user_log_id
      }).then(res => {
        this.userLogModelReset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 用户日志删除
    userLogDelete(row) {
      this.$confirm(
        '确定要删除用户日志 <span style="color:red">' + row.user_log_id + ' </span>吗？',
        '删除：' + row.user_log_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        userLogDele({
          user_log_id: row.user_log_id
        }).then(res => {
          this.userLogList()
          this.userLogModelReset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 用户日志详情重置
    userLogModelReset(row = {}) {
      this.userLogModel = row
    },
    // 用户日志详情取消
    userLogCancel() {
      this.userLogDialog = false
      this.userLogModelReset()
    },
    // 用户日志详情确认
    userLogSubmit() {
      this.userLogDialog = false
      this.userLogModelReset()
    }
  }
}
</script>
