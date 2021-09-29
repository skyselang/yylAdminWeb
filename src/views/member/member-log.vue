<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="20">
          <el-select v-model="query.search_field" class="filter-item" style="width:110px;" placeholder="">
            <el-option value="member_id" label="会员ID" />
            <el-option value="username" label="会员账号" />
            <el-option value="api_url" label="接口链接" />
            <el-option value="api_name" label="接口名称" />
            <el-option value="request_ip" label="请求IP" />
            <el-option value="request_region" label="请求地区" />
            <el-option value="request_isp" label="请求ISP" />
            <el-option value="response_code" label="返回码" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item" style="width:230px;" placeholder="搜索内容" clearable />
          <el-select v-model="query.log_type" class="filter-item" style="width:110px;" placeholder="日志类型" clearable>
            <el-option :value="1" label="注册日志" />
            <el-option :value="2" label="登录日志" />
            <el-option :value="3" label="操作日志" />
          </el-select>
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
        <el-col :xs="24" :sm="4" style="text-align:right;">
          <el-button v-permission="['admin/MemberLog/clear']" class="filter-item" title="日志清除" @click="clear()">清除</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="data" :height="height" style="width: 100%" @sort-change="sort">
      <el-table-column prop="member_log_id" label="日志ID" min-width="100" sortable="custom" />
      <el-table-column prop="member_id" label="会员ID" min-width="100" sortable="custom" />
      <el-table-column prop="username" label="会员账号" min-width="110" show-overflow-tooltip />
      <el-table-column prop="api_url" label="接口链接" min-width="220" show-overflow-tooltip />
      <el-table-column prop="api_name" label="接口名称" min-width="130" show-overflow-tooltip />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" />
      <el-table-column prop="request_region" label="请求地区" min-width="150" show-overflow-tooltip />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" />
      <el-table-column prop="response_code" label="返回码" min-width="80" />
      <el-table-column prop="response_msg" label="返回描述" min-width="130" show-overflow-tooltip />
      <el-table-column prop="create_time" label="请求时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="90" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="info(row)">详情</el-button>
          <el-button size="mini" type="text" @click="dele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 详情 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" width="50%" :before-close="cancel">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="会员ID" prop="member_id">
          <el-col :span="10">
            <el-input v-model="model.member_id" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">会员昵称</el-col>
          <el-col :span="10">
            <el-input v-model="model.nickname" />
          </el-col>
        </el-form-item>
        <el-form-item label="会员账号" prop="username">
          <el-input v-model="model.username" />
        </el-form-item>
        <el-form-item label="接口ID" prop="api_id">
          <el-col :span="10">
            <el-input v-model="model.api_id" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">接口名称</el-col>
          <el-col :span="10">
            <el-input v-model="model.api_name" />
          </el-col>
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="model.api_url" />
        </el-form-item>
        <el-form-item label="请求方式" prop="request_method">
          <el-col :span="10">
            <el-input v-model="model.request_method" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">请求IP</el-col>
          <el-col :span="10">
            <el-input v-model="model.request_ip" />
          </el-col>
        </el-form-item>
        <el-form-item label="请求地区" prop="request_region">
          <el-col :span="10">
            <el-input v-model="model.request_region" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">请求ISP</el-col>
          <el-col :span="10">
            <el-input v-model="model.request_isp" />
          </el-col>
        </el-form-item>
        <el-form-item label="请求时间" prop="create_time">
          <el-input v-model="model.create_time" />
        </el-form-item>
        <el-form-item label="请求参数" prop="request_param">
          <pre>{{ model.request_param }}</pre>
        </el-form-item>
        <el-form-item label="返回码" prop="response_code">
          <el-input v-model="model.response_code" />
        </el-form-item>
        <el-form-item label="返回描述" prop="response_msg">
          <el-input v-model="model.response_msg" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 清除 -->
    <el-dialog :title="clearDialogTitle" :visible.sync="clearDialog" :before-close="clearCancel">
      <el-form ref="clearRef" :rules="clearRules" :model="clearModel" label-width="100px" class="dialog-body">
        <el-form-item label="会员ID" prop="member_id">
          <el-input v-model="clearModel.member_id" type="number" clearable />
        </el-form-item>
        <el-form-item label="会员账号" prop="username">
          <el-input v-model="clearModel.username" type="text" clearable />
        </el-form-item>
        <el-form-item label="接口ID" prop="api_id">
          <el-input v-model="clearModel.api_id" type="number" clearable />
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="clearModel.api_url" type="text" clearable />
        </el-form-item>
        <el-form-item label="日期范围" prop="date_value">
          <el-date-picker
            v-model="clearModel.date_value"
            type="daterange"
            class="filter-item"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="">
          <p>*清除后不可恢复</p>
          <p>*根据填写的条件清除</p>
          <p>*不填写清除条件将清空所有</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearCancel()">取消</el-button>
        <el-button type="primary" @click="clearSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { list, info, dele, clear } from '@/api/member-log'

export default {
  name: 'MemberLog',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      height: 680,
      loading: false,
      data: [],
      count: 0,
      query: {
        page: 1,
        limit: 15,
        search_field: 'member_id'
      },
      dialog: false,
      dialogTitle: '',
      model: {},
      rules: {},
      clearDialog: false,
      clearDialogTitle: '',
      clearModel: {
        member_id: '',
        username: '',
        api_id: '',
        api_url: '',
        date_value: []
      },
      clearRules: {}
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
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 详情
    info(row) {
      this.loading = true
      this.dialog = true
      this.dialogTitle = '会员日志详情：' + row.member_log_id
      info({
        member_log_id: row.member_log_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    dele(row) {
      this.$confirm(
        '确定要删除会员日志ID： <span style="color:red">' + row.member_log_id + ' </span>吗？',
        '删除会员日志：' + row.member_log_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.loading = true
        dele({
          member_log_id: row.member_log_id
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 取消
    cancel() {
      this.dialog = false
      this.reset()
    },
    // 确认
    submit() {
      this.dialog = false
      this.reset()
    },
    // 重置
    reset(row = {}) {
      this.model = row
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
    },
    // 清除
    clear() {
      this.clearDialog = true
      this.clearDialogTitle = '会员日志清除'
    },
    clearCancel() {
      this.clearDialog = false
    },
    clearSubmit() {
      this.loading = true
      clear(this.clearModel).then(res => {
        this.list()
        this.clearDialog = false
        this.clearModel = this.$options.data().clearModel
        this.$message.success('已清除日志记录 ' + res.data.count + ' 条')
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
