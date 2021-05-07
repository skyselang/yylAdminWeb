<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="21">
          <el-select v-model="query.log_type" class="filter-item" style="width:110px;" placeholder="日志类型" clearable>
            <el-option :value="1" label="登录日志" />
            <el-option :value="2" label="操作日志" />
          </el-select>
          <el-input v-model="query.user_keyword" class="filter-item" style="width: 150px;" placeholder="用户账号/昵称" clearable />
          <el-input v-model="query.request_keyword" class="filter-item" style="width: 155px;" placeholder="请求IP/地区/ISP" clearable />
          <el-input v-model="query.menu_keyword" class="filter-item" style="width: 250px;" placeholder="菜单链接/名称" clearable />
          <el-date-picker
            v-model="query.create_time"
            type="daterange"
            class="filter-item"
            style="width: 240px;"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-input v-model="query.response_code" class="filter-item" style="width: 100px;" placeholder="返回码" clearable />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="3" style="text-align:right;">
          <el-button v-permission="['admin/AdminUserLog/clear']" class="filter-item" title="日志清除" @click="clear()">清除</el-button>
          <el-button v-permission="['admin/AdminUserLog/stat']" class="filter-item" type="primary" title="日志统计" @click="stat">统计</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="data" :height="height" style="width: 100%" border @sort-change="sort">
      <el-table-column prop="admin_user_log_id" label="日志ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="nickname" label="用户昵称" min-width="110">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            用户ID: {{ scope.row.admin_user_id }} <br>
            用户账号: {{ scope.row.username }} <br>
            用户昵称: {{ scope.row.nickname }}
            <div slot="reference" class="name-wrapper">
              <el-tag>{{ scope.row.nickname }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="menu_url" label="菜单链接" min-width="240">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            菜单ID: {{ scope.row.admin_menu_id }} <br>
            菜单名称: {{ scope.row.menu_name }} <br>
            菜单链接: {{ scope.row.menu_url }}
            <div slot="reference" class="name-wrapper">
              {{ scope.row.menu_url }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="menu_name" label="菜单名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="request_method" label="请求方式" min-width="90" />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" />
      <el-table-column prop="request_region" label="请求地区" min-width="150" show-overflow-tooltip />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" show-overflow-tooltip />
      <el-table-column prop="create_time" label="请求时间" min-width="160" sortable="custom" />
      <el-table-column prop="response_code" label="返回码" min-width="80" />
      <el-table-column prop="response_msg" label="返回描述" min-width="130" show-overflow-tooltip />
      <el-table-column label="操作" min-width="145" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="info(row)">详情</el-button>
          <el-button size="mini" type="danger" @click="dele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="lists" />
    <!-- 详情 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" width="50%" :before-close="cancel">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+30+'px'}">
        <el-form-item label="用户ID" prop="admin_user_id">
          <el-col :span="10">
            <el-input v-model="model.admin_user_id" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">用户昵称</el-col>
          <el-col :span="10">
            <el-input v-model="model.nickname" />
          </el-col>
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="model.username" />
        </el-form-item>
        <el-form-item label="菜单ID" prop="admin_menu_id">
          <el-col :span="10">
            <el-input v-model="model.admin_menu_id" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">菜单名称</el-col>
          <el-col :span="10">
            <el-input v-model="model.menu_name" />
          </el-col>
        </el-form-item>
        <el-form-item label="菜单链接" prop="menu_url">
          <el-input v-model="model.menu_url" />
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
          <el-input v-model="model.response_msg" type="textarea" />
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
        <el-form-item label="用户ID" prop="admin_user_id">
          <el-input v-model="clearModel.admin_user_id" type="number" clearable />
        </el-form-item>
        <el-form-item label="菜单ID" prop="admin_menu_id">
          <el-input v-model="clearModel.admin_menu_id" type="number" clearable />
        </el-form-item>
        <el-form-item label="日期范围" prop="clear_date">
          <el-date-picker
            v-model="clearModel.clear_date"
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
import { list, info, dele, clear } from '@/api/admin-user-log'

export default {
  name: 'UserLog',
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
        limit: 13
      },
      dialog: false,
      dialogTitle: '',
      model: {},
      rules: {},
      clearDialog: false,
      clearDialogTitle: '',
      clearModel: {
        admin_user_id: '',
        admin_menu_id: '',
        clear_date: []
      },
      clearRules: {}
    }
  },
  created() {
    this.height = screenHeight()
    this.lists()
  },
  methods: {
    // 列表
    lists() {
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
      this.dialogTitle = '日志管理详情：' + row.admin_user_log_id
      info({
        admin_user_log_id: row.admin_user_log_id
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
        '确定要删除日志管理 <span style="color:red">' + row.admin_user_log_id + ' </span>吗？',
        '删除日志管理：' + row.admin_user_log_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.loading = true
        dele({
          admin_user_log_id: row.admin_user_log_id
        }).then(res => {
          this.lists()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 取消
    cancel() {
      this.reset()
      this.dialog = false
    },
    // 确认
    submit() {
      this.reset()
      this.dialog = false
    },
    // 重置
    reset(row = '') {
      if (row === '') {
        this.model = this.$options.data().model
      } else {
        this.model = row
      }
    },
    // 查询
    search() {
      this.query.page = 1
      this.lists()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.lists()
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.prop
      this.query.sort_type = ''
      if (sort.order === 'ascending') {
        this.query.sort_type = 'asc'
        this.lists()
      }
      if (sort.order === 'descending') {
        this.query.sort_type = 'desc'
        this.lists()
      }
    },
    // 清除
    clear() {
      this.clearDialog = true
      this.clearDialogTitle = '日志管理清除'
    },
    clearCancel() {
      this.clearDialog = false
    },
    clearSubmit() {
      this.loading = true
      clear(this.clearModel).then(res => {
        this.lists()
        this.clearDialog = false
        this.$message.success('已清除日志记录 ' + res.data.count + ' 条')
      }).catch(() => {
        this.loading = false
      })
    },
    // 统计
    stat() {
      this.$router.push('/admin/rule/user-log-stat')
    }
  }
}
</script>
