<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option value="member_id" label="会员ID" />
            <el-option value="api_id" label="接口" />
            <el-option value="request_ip" label="请求IP" />
            <el-option value="request_region" label="请求地区" />
            <el-option value="request_isp" label="请求ISP" />
            <el-option value="response_code" label="返回码" />
            <el-option value="log_type" label="日志类型" />
            <el-option value="platform" label="平台" />
            <el-option value="application" label="应用" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option
              v-for="exp in exps"
              :key="exp.exp"
              :value="exp.exp"
              :label="exp.name"
            />
          </el-select>
          <el-cascader
            v-if="query.search_field === 'api_id'"
            v-model="query.search_value"
            class="filter-item ya-search-value"
            placeholder="接口"
            :options="apiData"
            :props="apiProps"
            clearable
            filterable
            collapse-tags
          />
          <el-select
            v-else-if="query.search_field === 'log_type'"
            v-model="query.search_value"
            class="filter-item ya-search-value"
            placeholder="日志类型"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in logTypes"
              :key="index"
              :value="index"
              :label="item"
            />
          </el-select>
          <el-select
            v-else-if="query.search_field === 'platform'"
            v-model="query.search_value"
            class="filter-item ya-search-value"
            clearable
          >
            <el-option
              v-for="(item, index) in platforms"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
          <el-select
            v-else-if="query.search_field === 'application'"
            v-model="query.search_value"
            class="filter-item ya-search-value"
            clearable
          >
            <el-option
              v-for="(item, index) in applications"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
          <el-input
            v-else
            v-model="query.search_value"
            class="filter-item ya-search-value"
            placeholder="查询内容"
            clearable
          />
          <el-date-picker
            v-model="query.date_value"
            type="datetimerange"
            class="filter-item ya-date-value"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <el-button
            class="filter-item"
            type="primary"
            title="查询/刷新"
            @click="search()"
          >查询</el-button>
          <el-button
            class="filter-item"
            icon="el-icon-refresh"
            title="重置"
            @click="refresh()"
          />
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button title="删除选择" @click="selectOpen('dele')">删除</el-button>
          <el-button title="删除查询结果" @click="clear()">清空</el-button>
        </el-col>
      </el-row>
      <el-dialog
        :title="selectTitle"
        :visible.sync="selectDialog"
        top="20vh"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form label-width="120px">
          <el-form-item :label="name + 'ID'" prop="">
            <el-input
              v-model="selectIds"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 12 }"
              disabled
            />
          </el-form-item>
          <el-form-item v-if="selectType === 'dele'" label="" prop="">
            <span class="ya-color-red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectCancel">取消</el-button>
          <el-button type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :height="height"
      @sort-change="sort"
      @selection-change="select"
    >
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column
        :prop="idkey"
        label="ID"
        width="80"
        show-overflow-tooltip
        sortable="custom"
      />
      <el-table-column prop="member_id" label="会员ID" min-width="68" />
      <el-table-column
        prop="username"
        label="会员昵称"
        min-width="85"
        show-overflow-tooltip
      />
      <el-table-column
        prop="username"
        label="会员用户名"
        min-width="92"
        show-overflow-tooltip
      />
      <el-table-column prop="api_id" label="接口ID" min-width="65" />
      <el-table-column
        prop="api_name"
        label="接口名称"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="api_url"
        label="接口链接"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column
        prop="request_ip"
        label="请求IP"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="request_region"
        label="请求地区"
        min-width="145"
        show-overflow-tooltip
      />
      <el-table-column
        prop="request_isp"
        label="请求ISP"
        min-width="90"
        show-overflow-tooltip
      />
      <el-table-column
        prop="response_code"
        label="返回码"
        min-width="70"
        show-overflow-tooltip
      />
      <el-table-column
        prop="response_msg"
        label="返回描述"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="application_name"
        label="应用"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="create_time"
        label="请求时间"
        width="155"
        sortable="custom"
      />
      <el-table-column label="操作" width="85">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="info(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="selectOpen('dele', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="count > 0"
      :total="count"
      :page.sync="query.page"
      :limit.sync="query.limit"
      @pagination="list"
    />
    <!-- 详情 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialog"
      top="5vh"
      :before-close="cancel"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="ref"
        :rules="rules"
        :model="model"
        label-width="110px"
        class="dialog-body"
        :style="{ height: height + 'px' }"
      >
        <el-form-item label="会员ID" prop="member_id">
          <el-input v-model="model.member_id" />
        </el-form-item>
        <el-form-item label="会员昵称" prop="nickname">
          <el-input v-model="model.nickname" />
        </el-form-item>
        <el-form-item label="会员用户名" prop="username">
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
        <el-form-item label="返回码" prop="response_code">
          <el-input v-model="model.response_code" />
        </el-form-item>
        <el-form-item label="返回描述" prop="response_msg">
          <el-input v-model="model.response_msg" />
        </el-form-item>
        <el-form-item label="用户代理" prop="user_agent">
          <el-input v-model="model.user_agent" type="textarea" autosize />
        </el-form-item>
        <el-form-item label="平台" prop="platform_name">
          <el-input v-model="model.platform_name" />
        </el-form-item>
        <el-form-item label="应用" prop="application_name">
          <el-input v-model="model.application_name" />
        </el-form-item>
        <el-form-item label="请求参数" prop="request_param">
          <el-button
            type="text"
            icon="el-icon-copy-document"
            title="复制参数"
            @click="requestParamCopy($event)"
          />
          <pre ref="requestParamRef">{{ model.request_param }}</pre>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import { list, info, dele, clear } from '@/api/member/log'

export default {
  name: 'MemberLog',
  components: { Pagination },
  directives: {},
  data() {
    return {
      name: '会员日志',
      height: 680,
      loading: false,
      idkey: 'log_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: { page: 1, limit: getPageLimit(), search_field: 'member_id', search_exp: 'like', date_field: 'create_time' },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {},
      rules: {},
      logTypes: [],
      platforms: [],
      applications: [],
      apiData: [],
      apiProps: { checkStrictly: true, value: 'api_id', label: 'api_name', multiple: true, emitPath: false },
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: ''
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
        this.apiData = res.data.api
        this.platforms = res.data.platforms
        this.applications = res.data.applications
        this.logTypes = res.data.log_types
        this.exps = res.data.exps
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
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
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
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => { } })
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
          this.selectTitle = this.name + '删除'
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
    // 清空
    clear() {
      this.$confirm('确定要清空' + this.name + '(查询结果或所有)吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clear(this.query).then(res => {
          this.list()
          this.$message.success('清空' + this.name + '记录 ' + res.data.count + ' 条')
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    // 复制
    copy(text, event) {
      clip(text, event)
    },
    // 参数复制
    requestParamCopy(event) {
      const text = this.$refs.requestParamRef
      this.copy(text, event)
    }
  }
}
</script>
