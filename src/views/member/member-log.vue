<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="member_id" label="会员ID" />
            <el-option value="username" label="会员账号" />
            <el-option value="api_url" label="接口链接" />
            <el-option value="api_name" label="接口名称" />
            <el-option value="request_ip" label="请求IP" />
            <el-option value="request_region" label="请求地区" />
            <el-option value="request_isp" label="请求ISP" />
            <el-option value="response_code" label="返回码" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="filter-item ya-date-value"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-select v-model="query.log_type" class="filter-item ya-search-field" placeholder="日志类型" clearable>
            <el-option :value="1" label="注册日志" />
            <el-option :value="2" label="登录日志" />
            <el-option :value="3" label="操作日志" />
          </el-select>
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button @click="selectOpen('dele')">删除</el-button>
          <el-button v-permission="['admin/MemberLog/clear']" @click="clear()">清除</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :rows="2" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='dele'" label="" prop="">
            <span style="color:red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectCancel">取消</el-button>
          <el-button type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" min-width="100" sortable="custom" />
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
      <el-table-column label="操作" min-width="85" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="info(row)">详情</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 详情 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="会员ID" prop="member_id">
          <el-input v-model="model.member_id" />
        </el-form-item>
        <el-form-item label="会员昵称" prop="nickname">
          <el-input v-model="model.nickname" />
        </el-form-item>
        <el-form-item label="会员账号" prop="username">
          <el-input v-model="model.username" />
        </el-form-item>
        <el-form-item label="接口ID" prop="api_id">
          <el-input v-model="model.api_id" />
        </el-form-item>
        <el-form-item label="接口名称" prop="api_name">
          <el-input v-model="model.api_name" />
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="model.api_url" />
        </el-form-item>
        <el-form-item label="请求方式" prop="request_method">
          <el-input v-model="model.request_method" />
        </el-form-item>
        <el-form-item label="请求IP" prop="request_ip">
          <el-input v-model="model.request_ip" />
        </el-form-item>
        <el-form-item label="请求地区" prop="request_region">
          <el-input v-model="model.request_region" />
        </el-form-item>
        <el-form-item label="请求ISP" prop="request_isp">
          <el-input v-model="model.request_isp" />
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
    <el-dialog :title="clearDialogTitle" :visible.sync="clearDialog" :before-close="clearCancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="clearRef" :rules="clearRules" :model="clearModel" label-width="100px" class="dialog-body">
        <el-form-item label="会员ID" prop="member_id">
          <el-input v-model="clearModel.member_id" placeholder="多个逗号,隔开" clearable />
        </el-form-item>
        <el-form-item label="会员账号" prop="username">
          <el-input v-model="clearModel.username" placeholder="多个逗号,隔开" clearable />
        </el-form-item>
        <el-form-item label="接口ID" prop="api_id">
          <el-input v-model="clearModel.api_id" placeholder="多个逗号,隔开" clearable />
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="clearModel.api_url" placeholder="多个逗号,隔开" clearable />
        </el-form-item>
        <el-form-item label="请求时间" prop="date_value">
          <el-date-picker
            v-model="clearModel.date_value"
            type="daterange"
            class="filter-item"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="清空所有" prop="clean">
          <el-switch v-model="clearModel.clean" :active-value="1" :inactive-value="0" />
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
import { arrayColumn } from '@/utils/index'
import { list, info, dele, clear } from '@/api/member-log'

export default {
  name: 'MemberLog',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      name: '会员日志',
      height: 680,
      loading: false,
      idkey: 'member_log_id',
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
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      clearDialog: false,
      clearDialogTitle: '',
      clearModel: {
        member_id: '',
        username: '',
        api_id: '',
        api_url: '',
        date_value: [],
        clean: 0
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
      this.dialog = true
      this.dialogTitle = this.name + '详情：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.model = res.data
      })
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
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
    // 选中操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds(selection).toString()
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => {} })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        this.$refs['table'].toggleRowSelection(selectRow)
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '选中操作'
        if (selectType === 'dele') {
          this.selectTitle = '删除' + this.name
        }
        this.selectDialog = true
        this.selectType = selectType
      }
    },
    selectCancel() {
      this.selectDialog = false
    },
    selectSubmit() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        const selectType = this.selectType
        if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        dele({
          ids: this.selectGetIds(row)
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 清除
    clear() {
      this.clearDialog = true
      this.clearDialogTitle = this.name + '清除'
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
        this.$message.success('已清除' + this.name + ' ' + res.data.count + ' 条')
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
