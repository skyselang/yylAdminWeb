<template>
  <!-- 查询 -->
  <div class="filter-container">
    <el-row>
      <el-col>
        <el-button title="删除选择" class="ya-margin-right" @click="selectOpen('dele')"> 删除 </el-button>
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="request_ip" label="请求IP" />
          <el-option value="request_region" label="请求地区" />
          <el-option value="request_isp" label="请求ISP" />
          <el-option value="log_type" label="日志类型" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-select
          v-if="query.search_field == 'log_type'"
          v-model="query.search_value"
          class="ya-search-value"
          placeholder="日志类型"
          clearable
        >
          <el-option v-for="(item, index) in logTypes" :key="index" :value="index" :label="item" />
        </el-select>
        <el-input v-else v-model="query.search_value" class="ya-search-value" placeholder="查询内容" clearable />
        <el-date-picker
          v-model="query.date_value"
          type="datetimerange"
          class="ya-date-value"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[new Date(2024, 1, 1, 0, 0, 0), new Date(2024, 1, 1, 23, 59, 59)]"
        />
        <el-button type="primary" title="查询/刷新" @click="search()">查询</el-button>
        <el-button type="default" title="重置查询条件" @click="refresh()">重置</el-button>
      </el-col>
    </el-row>
    <!-- 操作 -->
    <el-dialog
      v-model="selectDialog"
      :title="selectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
    >
      <el-form ref="selectRef" label-width="120px">
        <el-form-item :label="name + 'ID'">
          <el-input v-model="selectIds" type="textarea" autosize disabled />
        </el-form-item>
        <el-form-item v-if="selectType === 'dele'">
          <span class="c-red">确定要删除选中的{{ name }}吗？</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="loading" @click="selectCancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
      </template>
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
    <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
    <el-table-column prop="menu_id" label="菜单ID" min-width="100" />
    <el-table-column prop="menu_name" label="菜单名称" min-width="150" show-overflow-tooltip />
    <el-table-column prop="menu_url" label="菜单链接" min-width="250" show-overflow-tooltip />
    <el-table-column prop="request_ip" label="请求IP" min-width="130" />
    <el-table-column prop="request_region" label="请求地区" min-width="160" show-overflow-tooltip />
    <el-table-column prop="request_isp" label="请求ISP" min-width="110" show-overflow-tooltip />
    <el-table-column prop="response_code" label="返回码" min-width="80" show-overflow-tooltip />
    <el-table-column prop="response_msg" label="返回描述" min-width="115" show-overflow-tooltip />
    <el-table-column prop="create_time" label="请求时间" min-width="165" sortable="custom" />
    <el-table-column label="操作" width="95">
      <template #default="scope">
        <el-link type="primary" class="mr-1" :underline="false" @click="info(scope.row)"> 详情 </el-link>
        <el-link type="primary" :underline="false" @click="selectOpen('dele', [scope.row])"> 删除 </el-link>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <pagination
    v-show="count > 0"
    v-model:total="count"
    v-model:page="query.page"
    v-model:limit="query.limit"
    @pagination="list"
  />
  <!-- 详情 -->
  <el-dialog
    v-model="dialog"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancel"
    top="5vh"
  >
    <el-scrollbar native :height="height">
      <el-form ref="ref" :rules="rules" :model="model" label-width="110px">
        <el-form-item label="用户ID" prop="user_id">
          <el-input v-model="model.user_id" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="model.nickname" />
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="model.username" />
        </el-form-item>
        <el-form-item label="菜单ID" prop="menu_id">
          <el-input v-model="model.menu_id" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="model.menu_name" />
        </el-form-item>
        <el-form-item label="菜单链接" prop="menu_url">
          <el-input v-model="model.menu_url" />
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
          <el-input v-model="model.response_msg" type="textarea" />
        </el-form-item>
        <el-form-item label="用户代理" prop="user_agent">
          <el-input v-model="model.user_agent" type="textarea" autosize />
        </el-form-item>
        <el-form-item label="请求参数" prop="request_param">
          <el-col :span="24">
            <el-button text type="primary" title="复制参数" @click="requestParamCopy()">
              <svg-icon icon-class="copy-document" />
            </el-button>
          </el-col>
          <pre ref="requestParamRef">{{ model.request_param }}</pre>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button :loading="loading" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import { arrayColumn, clipboard } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import { log, logInfo, logDele } from '@/api/system/user-center'

export default {
  name: 'SystemUserCenterLog',
  components: { Pagination },
  data() {
    return {
      name: '我的日志',
      height: 680,
      loading: true,
      idkey: 'log_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'request_region',
        search_exp: 'like',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {},
      rules: {},
      logTypes: [],
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: ''
    }
  },
  created() {
    this.height = screenHeight(310)
    this.list()
  },
  methods: {
    clipboard,
    // 列表
    list() {
      this.loading = true
      log(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.logTypes = res.data.log_types
          this.exps = res.data.exps
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 详情
    info(row) {
      this.dialog = true
      this.dialogTitle = this.name + '详情：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      logInfo(id)
        .then((res) => {
          this.reset(res.data)
        })
        .catch(() => {})
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
    // 重置查询
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
    // 操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds(selection).toString()
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      ElMessageBox.alert('请选择需要操作的' + this.name, '提示', {
        type: 'warning',
        callback: () => {}
      })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        const selectRowLen = selectRow.length
        for (let i = 0; i < selectRowLen; i++) {
          this.$refs['table'].toggleRowSelection(selectRow[i], true)
        }
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '操作'
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
        logDele({
          ids: this.selectGetIds(row)
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 参数复制
    requestParamCopy() {
      const text = this.$refs.requestParamRef
      clipboard(text.textContent)
    }
  }
}
</script>
