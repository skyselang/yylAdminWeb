<template>
  <div class="app-container">
    <!-- 会员日志查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="23">
          <el-select v-model="memberLogQuery.log_type" class="filter-item" placeholder="日志类型" style="width:110px;" clearable>
            <el-option key="log_type1" label="登录日志" :value="1" />
            <el-option key="log_type2" label="操作日志" :value="2" />
          </el-select>
          <el-input v-model="memberLogQuery.member_keyword" class="filter-item" style="width: 135px;" placeholder="会员账号/昵称" clearable />
          <el-input v-model="memberLogQuery.request_keyword" class="filter-item" style="width: 155px;" placeholder="请求IP/地区/ISP" clearable />
          <el-input v-model="memberLogQuery.api_keyword" class="filter-item" style="width: 280px;" placeholder="接口链接/名称" clearable />
          <el-date-picker
            v-model="memberLogQuery.create_time"
            type="daterange"
            style="width: 240px;top: -4px;"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
          <el-button class="filter-item" type="primary" @click="memberLogSearch()">查询</el-button>
          <el-button class="filter-item" @click="memberLogReset()">重置</el-button>
        </el-col>
        <el-col :xs="24" :sm="1" style="text-align:right;">
          <el-button v-permission="['admin/MemberLog/memberLogSta']" class="filter-item" type="primary" title="会员日志统计" @click="memberLogSta">统计</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 会员日志列表 -->
    <el-table v-loading="loading" :data="memberLogData" :height="height" style="width: 100%" border @sort-change="memberLogSort">
      <el-table-column prop="member_log_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="username" label="会员账号" min-width="110" sortable="custom" />
      <el-table-column prop="nickname" label="会员昵称" min-width="110" />
      <el-table-column prop="api_url" label="接口链接" min-width="235" sortable="custom" />
      <el-table-column prop="api_name" label="接口名称" min-width="130" />
      <el-table-column prop="request_method" label="请求方式 " min-width="110" sortable="custom" />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" sortable="custom" />
      <el-table-column prop="request_region" label="请求地区" min-width="150" />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" />
      <el-table-column prop="create_time" label="请求时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="150" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="memberLogDetail(row)">详情</el-button>
          <el-button size="mini" type="danger" @click="memberLogDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 会员日志分页 -->
    <pagination v-show="memberLogCount > 0" :total="memberLogCount" :page.sync="memberLogQuery.page" :limit.sync="memberLogQuery.limit" @pagination="memberLogList" />
    <!-- 会员日志详情 -->
    <el-dialog :title="memberLogDialogTitle" :visible.sync="memberLogDialog" top="1vh" :before-close="memberLogCancel">
      <el-form ref="memberLogRef" :rules="memberLogRules" :model="memberLogModel" label-width="100px" class="dialog-body" :style="{height:height+30+'px'}">
        <el-form-item label="会员ID" prop="member_id">
          <el-col :span="10">
            <el-input v-model="memberLogModel.member_id" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">会员昵称</el-col>
          <el-col :span="10">
            <el-input v-model="memberLogModel.nickname" />
          </el-col>
        </el-form-item>
        <el-form-item label="会员账号" prop="username">
          <el-input v-model="memberLogModel.username" />
        </el-form-item>
        <el-form-item label="接口ID" prop="api_id">
          <el-col :span="10">
            <el-input v-model="memberLogModel.api_id" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">接口名称</el-col>
          <el-col :span="10">
            <el-input v-model="memberLogModel.api_name" />
          </el-col>
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="memberLogModel.api_url" />
        </el-form-item>
        <el-form-item label="请求方式" prop="request_method">
          <el-col :span="10">
            <el-input v-model="memberLogModel.request_method" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">请求IP</el-col>
          <el-col :span="10">
            <el-input v-model="memberLogModel.request_ip" />
          </el-col>
        </el-form-item>
        <el-form-item label="请求地区" prop="request_region">
          <el-col :span="10">
            <el-input v-model="memberLogModel.request_region" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">请求ISP</el-col>
          <el-col :span="10">
            <el-input v-model="memberLogModel.request_isp" />
          </el-col>
        </el-form-item>
        <el-form-item label="请求时间" prop="create_time">
          <el-input v-model="memberLogModel.create_time" />
        </el-form-item>
        <el-form-item label="请求参数" prop="request_param">
          <pre>{{ memberLogModel.request_param }}</pre>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="memberLogCancel">取消</el-button>
        <el-button type="primary" @click="memberLogSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { memberLogList, memberLogInfo, memberLogDele } from '@/api/member-log'

export default {
  name: 'MemberLog',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      height: 680,
      loading: false,
      memberLogData: [],
      memberLogCount: 0,
      memberLogQuery: {
        page: 1,
        limit: 13
      },
      memberLogDialog: false,
      memberLogDialogTitle: '',
      memberLogModel: {},
      memberLogRules: {}
    }
  },
  created() {
    this.height = screenHeight()
    this.memberLogList()
  },
  methods: {
    // 会员日志列表
    memberLogList() {
      this.loading = true
      memberLogList(this.memberLogQuery).then(res => {
        this.memberLogData = res.data.list
        this.memberLogCount = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 会员日志查询
    memberLogSearch() {
      this.memberLogQuery.page = 1
      this.memberLogList()
    },
    // 会员日志重置
    memberLogReset() {
      this.memberLogQuery = this.$options.data().memberLogQuery
      this.memberLogList()
    },
    // 会员日志排序
    memberLogSort(sort) {
      this.memberLogQuery.sort_field = sort.prop
      this.memberLogQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.memberLogQuery.sort_type = 'asc'
        this.memberLogList()
      }
      if (sort.order === 'descending') {
        this.memberLogQuery.sort_type = 'desc'
        this.memberLogList()
      }
    },
    // 会员日志统计
    memberLogSta() {
      this.$router.push('/member/member-logsta')
    },
    // 会员日志详情
    memberLogDetail(row) {
      this.loading = true
      this.memberLogDialog = true
      this.memberLogDialogTitle = '会员日志详情：' + row.member_log_id
      memberLogInfo({
        member_log_id: row.member_log_id
      }).then(res => {
        this.memberLogModelReset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 会员日志删除
    memberLogDelete(row) {
      this.$confirm(
        '确定要删除会员日志 <span style="color:red">' + row.member_log_id + ' </span>吗？',
        '删除：' + row.member_log_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        memberLogDele({
          member_log_id: row.member_log_id
        }).then(res => {
          this.memberLogList()
          this.memberLogModelReset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 会员日志详情重置
    memberLogModelReset(row = {}) {
      this.memberLogModel = row
    },
    // 会员日志详情取消
    memberLogCancel() {
      this.memberLogDialog = false
      this.memberLogModelReset()
    },
    // 会员日志详情确认
    memberLogSubmit() {
      this.memberLogDialog = false
      this.memberLogModelReset()
    }
  }
}
</script>
