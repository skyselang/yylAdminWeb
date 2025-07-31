<template>
  <!-- 查询 -->
  <el-row class="mb-2">
    <el-col :span="3">
      <el-select v-model="query.search[0].field" :placeholder="$t('查询字段')">
        <el-option v-for="field in searchFields" :key="field.field" :value="field.field" :label="field.name" />
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-select v-model="query.search[0].exp" :placeholder="$t('查询方式')">
        <el-option v-for="exp in basedata.exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
      </el-select>
    </el-col>
    <el-col :span="6">
      <LogSearch v-model="query.search[0]" :basedata="basedata" />
    </el-col>
    <el-col :span="6">
      <el-button :title="$t('更多条件')" :type="query.search.length > 1 ? 'primary' : ''" text @click="searchMore()">
        {{ $t('更多') }}
      </el-button>
      <el-button :title="$t('查询刷新')" type="primary" class="ml-0!" @click="search()">
        {{ $t('查询') }}
      </el-button>
      <el-button :title="$t('重置查询')" @click="searchReset()">{{ $t('重置') }}</el-button>
    </el-col>
  </el-row>
  <el-dialog
    v-model="searchDialog"
    :title="$t('更多条件查询', { name: name })"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    draggable
    center
    align-center
  >
    <el-row class="mb-2">
      <el-col :span="4">
        <el-button text>{{ $t('匹配模式') }}：</el-button>
      </el-col>
      <el-col :span="6">
        <el-select v-model="query.search_mode">
          <el-option value="and" :label="$t('所有条件匹配')" />
          <el-option value="or" :label="$t('任一条件匹配')" />
        </el-select>
      </el-col>
      <el-col :span="2" :offset="4">
        <el-button class="ml-3" :title="$t('新增一行')" type="primary" @click="searchAdd()">
          {{ $t('新增') }}
        </el-button>
      </el-col>
      <el-col :span="4" :offset="4">
        <el-button class="ml-3" :title="$t('全部删除')" @click="searchDele(-1)">{{ $t('全删') }}</el-button>
      </el-col>
    </el-row>
    <el-scrollbar :height="height - 200">
      <el-row v-for="(item, index) in query.search" :key="index" class="mb-2">
        <el-col :span="2">
          <el-button text>{{ index + 1 }}：</el-button>
        </el-col>
        <el-col :span="5">
          <el-select v-model="item.field" :placeholder="$t('查询字段')">
            <el-option v-for="field in searchFields" :key="field.field" :value="field.field" :label="field.name" />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select v-model="item.exp" :placeholder="$t('查询方式')">
            <el-option v-for="exp in basedata.exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <LogSearch v-model="query.search[index]" :basedata="basedata" />
        </el-col>
        <el-col :span="4">
          <el-button v-if="index > 0" class="ml-3" @click="searchDele(index)">{{ $t('删除') }}</el-button>
        </el-col>
      </el-row>
    </el-scrollbar>
    <template #footer>
      <el-button :loading="loading" @click="searchCancel">{{ $t('关闭') }}</el-button>
      <el-button :loading="loading" type="primary" @click="searchSubmit">{{ $t('查询') }}</el-button>
    </template>
  </el-dialog>
  <!-- 操作 -->
  <el-row>
    <el-col>
      <el-button v-if="hasPerm(['admin/system.UserCenter/logDele'])" :title="$t('删除选择')" @click="operate('delete')">
        {{ $t('删除') }}
      </el-button>
      <el-button v-if="hasPerm(['admin/system.UserCenter/logClear'])" :title="$t('清空日志')" @click="operate('clear')">
        {{ $t('清空') }}
      </el-button>
    </el-col>
  </el-row>
  <el-dialog
    v-model="operateDialog"
    :title="operateTitle"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    center
    align-center
  >
    <el-scrollbar :height="height - 220">
      <el-form ref="ref" label-width="120px">
        <el-form-item v-if="operateType === 'delete'" :label="$t('删除')">
          <el-text size="default" type="danger">{{ $t('确定要删除选中的吗', { name: name }) }}</el-text>
        </el-form-item>
        <el-form-item v-else-if="operateType === 'clear'" :label="$t('清空')">
          <el-text size="default" type="danger">{{ $t('确定要清空所有记录或查询记录吗') }}</el-text>
        </el-form-item>
        <el-form-item label="ID">
          <el-col>
            <el-text size="default">{{ operateIds.toString() }}</el-text>
          </el-col>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button :loading="loading" @click="operateCancel">{{ $t('取消') }}</el-button>
      <el-button :loading="loading" type="primary" @click="operateSubmit">{{ $t('提交') }}</el-button>
    </template>
  </el-dialog>
  <!-- 列表 -->
  <el-table
    ref="table"
    v-loading="loading"
    :data="data"
    :height="height"
    show-overflow-tooltip
    @sort-change="sort"
    @selection-change="operateSelect"
  >
    <el-table-column type="selection" width="42" :title="$t('全选/反选')" />
    <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
    <el-table-column prop="menu_name" :label="$t('菜单名称')" min-width="150" />
    <el-table-column prop="menu_url" :label="$t('菜单链接')" min-width="250" />
    <el-table-column prop="request_ip" :label="$t('请求IP')" min-width="130" />
    <el-table-column prop="request_region" :label="$t('请求地区')" min-width="160" />
    <el-table-column prop="request_isp" :label="$t('请求ISP')" min-width="110" />
    <el-table-column prop="response_code" :label="$t('返回码')" min-width="80" />
    <el-table-column prop="response_msg" :label="$t('返回描述')" min-width="115" />
    <el-table-column prop="create_time" :label="$t('请求时间')" min-width="165" sortable="custom" />
    <el-table-column :label="$t('操作')" width="100">
      <template #default="{ row }">
        <ElLinkOperate v-if="hasPerm(['admin/system.UserCenter/logInfo'])" :text="$t('详情')" @click="info(row)" />
        <ElLinkOperate
          v-if="hasPerm(['admin/system.UserCenter/logDele'])"
          :text="$t('删除')"
          @click="operate('delete', row)"
        />
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <Pagination v-model:total="count" v-model:page="query.page" v-model:limit="query.limit" @pagination="list" />
  <!-- 详情 -->
  <el-dialog
    v-model="dialog"
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancel"
    draggable
    center
    align-center
  >
    <el-scrollbar :height="height - 50">
      <el-form ref="ref" :rules="rules" :model="model" label-width="110px">
        <el-form-item :label="$t('用户ID')" prop="user_id">
          <el-input v-model="model.user_id" />
        </el-form-item>
        <el-form-item :label="$t('用户昵称')" prop="nickname">
          <el-input v-model="model.nickname" />
        </el-form-item>
        <el-form-item :label="$t('用户账号')" prop="username">
          <el-input v-model="model.username" />
        </el-form-item>
        <el-form-item :label="$t('菜单ID')" prop="menu_id">
          <el-input v-model="model.menu_id" />
        </el-form-item>
        <el-form-item :label="$t('菜单名称')" prop="menu_name">
          <el-input v-model="model.menu_name" />
        </el-form-item>
        <el-form-item :label="$t('菜单链接')" prop="menu_url">
          <el-input v-model="model.menu_url">
            <template #append><Clipboard :content="model.menu_url" /></template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('请求方法')" prop="request_method">
          <el-input v-model="model.request_method" />
        </el-form-item>
        <el-form-item :label="$t('请求IP')" prop="request_ip">
          <el-input v-model="model.request_ip" />
        </el-form-item>
        <el-form-item :label="$t('请求地区')" prop="request_region">
          <el-input v-model="model.request_region" />
        </el-form-item>
        <el-form-item :label="$t('请求ISP')" prop="request_isp">
          <el-input v-model="model.request_isp" />
        </el-form-item>
        <el-form-item :label="$t('请求时间')" prop="create_time">
          <el-input v-model="model.create_time" />
        </el-form-item>
        <el-form-item :label="$t('返回码')" prop="response_code">
          <el-input v-model="model.response_code" />
        </el-form-item>
        <el-form-item :label="$t('返回描述')" prop="response_msg">
          <el-input v-model="model.response_msg" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('用户代理')" prop="user_agent">
          <el-input v-model="model.user_agent" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('请求参数')" prop="request_param">
          <el-col v-if="model[idkey]">
            <Clipboard :content="model.request_param" />
          </el-col>
          <el-input v-model="model.request_param" type="textarea" placeholder="json" autosize />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button :loading="loading" @click="cancel">{{ $t('取消') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { hasPerm, arrayColumn, getPageLimit, screenHeight } from '@/utils/index'
import { logListApi, logInfoApi, logDeleApi, logClearApi } from '@/api/system/user-center'
import LogSearch from './LogSearch.vue'

export default {
  components: { LogSearch },
  data() {
    return {
      name: '',
      height: 680,
      loading: false,
      idkey: 'log_id',
      query: {
        page: 1,
        limit: getPageLimit(),
        search_mode: 'and',
        search: [{ field: 'menu_name', exp: 'like', value: '' }]
      },
      data: [],
      count: 0,
      dialog: false,
      title: '',
      model: {},
      rules: {},
      basedata: { exps: [], log_types: [] },
      searchDialog: false,
      searchFields: [],
      operateIds: [],
      operateType: '',
      operateDialog: false,
      operateTitle: '操作'
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('我的日志')
      this.height = screenHeight(340)
      this.searchInit()
      this.list()
      this.basedata.exps = [{ exp: 'like', name: this.$t('包含') }]
    },
    // 列表
    list() {
      this.loading = true
      logListApi(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.loading = false
          this.basedata.exps = res.data.basedata.exps
          this.basedata.log_types = res.data.basedata.log_types
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.column?.columnKey ?? sort.prop
      this.query.sort_value = ''
      if (sort.order === 'ascending') {
        this.query.sort_value = 'asc'
      } else if (sort.order === 'descending') {
        this.query.sort_value = 'desc'
      }
      this.list()
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    searchInit() {
      this.searchFields = [
        { field: this.idkey, name: 'ID', exp: '=' },
        { field: 'log_type', name: this.$t('日志类型'), exp: '=' },
        { field: 'menu_name', name: this.$t('菜单名称'), exp: 'like' },
        { field: 'request_url', name: this.$t('菜单链接'), exp: 'like' },
        { field: 'request_ip', name: this.$t('请求IP'), exp: 'like' },
        { field: 'request_region', name: this.$t('请求地区'), exp: 'like' },
        { field: 'request_isp', name: this.$t('请求ISP'), exp: 'like' },
        { field: 'response_code', name: this.$t('返回码'), exp: 'like' },
        { field: 'response_msg', name: this.$t('返回描述'), exp: 'like' },
        { field: 'create_time', name: this.$t('请求时间'), exp: '>=' }
      ]
    },
    searchMore() {
      this.searchDialog = true
    },
    searchReset() {
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.query.limit = limit
      this.$refs.table.clearSort()
      this.search()
    },
    searchAdd() {
      const searchFields_length = this.searchFields.length
      const search_length = this.query.search.length
      let field = ''
      let exp = ''
      if (search_length <= searchFields_length) {
        field = this.searchFields[search_length - 1].field ?? ''
        exp = this.searchFields[search_length - 1].exp ?? 'like'
      }
      this.query.search.push({ field: field, exp: exp, value: '' })
    },
    searchDele(index) {
      if (index === -1) {
        this.query.search = this.$options.data().query.search
      } else {
        this.query.search.splice(index, 1)
      }
    },
    searchCancel() {
      this.searchDialog = false
    },
    searchSubmit() {
      this.searchDialog = false
      this.search()
    },
    // 操作
    operate(type, row) {
      const noSelectType = ['clear']
      if (row) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(row, true)
        this.operateIds = [row[this.idkey]]
      }
      if (this.operateIds.length || noSelectType.includes(type)) {
        this.operateDialog = true
        this.operateTitle = this.name + '：' + this.$t('操作')
        this.operateType = type
      } else {
        this.operateAlert()
      }
    },
    operateSelect(rows) {
      this.operateIds = arrayColumn(rows, this.idkey)
    },
    operateCancel() {
      this.operateDialog = false
      this.operateType = ''
      this.loading = false
    },
    operateSubmit() {
      let api = logDeleApi
      let data = { ids: this.operateIds }
      if (this.operateType === 'clear') {
        api = logClearApi
        data = this.query
      }
      api(data)
        .then((res) => {
          ElMessage.success(res.msg)
          this.operateDialog = false
          this.operateType = ''
          this.operateIds = []
          this.list()
        })
        .catch(() => {})
    },
    operateAlert() {
      ElMessageBox.alert(this.$t('请选择需要操作的', { name: this.name }), this.$t('提示'), {
        type: 'warning',
        center: true,
        callback: () => {}
      })
    },
    // 详情
    info(row) {
      this.dialog = true
      this.title = this.name + '：' + row[this.idkey]
      let param = {}
      param[this.idkey] = row[this.idkey]
      logInfoApi(param)
        .then((res) => {
          this.models(res.data)
        })
        .catch(() => {})
    },
    cancel() {
      this.dialog = false
      this.models()
    },
    submit() {
      this.dialog = false
      this.models()
    },
    models(data) {
      if (data) {
        data.request_param = JSON.stringify(data.request_param)
        this.model = data
      } else {
        this.model = this.$options.data().model
      }
    }
  }
}
</script>
