<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="type" label="类型" />
          <el-option value="status" label="状态" />
          <el-option value="title" label="标题" />
          <el-option value="phone" label="手机" />
          <el-option value="email" label="邮箱" />
          <el-option value="receipt_no" label="回执" />
          <el-option value="remark" label="备注" />
          <el-option value="is_disable" label="禁用" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-select v-if="query.search_field === 'status'" v-model="query.search_value" class="ya-search-value">
          <el-option v-for="(item, index) in statuss" :key="index" :label="item" :value="index" />
        </el-select>
        <el-select v-else-if="query.search_field === 'is_disable'" v-model="query.search_value" class="ya-search-value">
          <el-option :value="1" label="是" />
          <el-option :value="0" label="否" />
        </el-select>
        <el-select v-else-if="query.search_field === 'type'" v-model="query.search_value" class="ya-search-value">
          <el-option v-for="(item, index) in types" :key="index" :label="item" :value="index" />
        </el-select>
        <el-input v-else v-model="query.search_value" class="ya-search-value" placeholder="查询内容" clearable />
        <el-select v-model="query.date_field" class="ya-date-field" placeholder="时间类型">
          <el-option value="create_time" label="添加时间" />
          <el-option value="update_time" label="修改时间" />
        </el-select>
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
        <el-button type="primary" @click="add()">添加</el-button>
      </el-col>
    </el-row>
    <!-- 操作 -->
    <el-row>
      <el-col>
        <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
        <el-button title="禁用" @click="selectOpen('disable')">禁用</el-button>
        <el-button title="状态" @click="selectOpen('status')">状态</el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-model="selectDialog"
      :title="selectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
    >
      <el-form label-width="120px">
        <el-form-item v-if="selectType === 'status'" label="状态">
          <el-select v-model="status" class="ya-search-value">
            <el-option v-for="(item, index) in statuss" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'disable'" label="是否禁用">
          <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'dele'">
          <span class="c-red">确定要删除选中的{{ name }}吗？</span>
        </el-form-item>
        <el-form-item :label="name + 'ID'">
          <el-input v-model="selectIds" type="textarea" autosize disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="loading" @click="selectCancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
      </template>
    </el-dialog>
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
      <el-table-column prop="member_username" label="会员" min-width="80" show-overflow-tooltip />
      <el-table-column prop="type_name" label="类型" min-width="80" show-overflow-tooltip />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="phone" label="手机" min-width="120" show-overflow-tooltip />
      <el-table-column prop="email" label="邮箱" min-width="130" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="100" show-overflow-tooltip />
      <el-table-column prop="status_name" label="状态" min-width="85" sortable="custom" />
      <el-table-column prop="is_disable_name" label="禁用" min-width="80" sortable="custom" />
      <el-table-column prop="receipt_no" label="回执编号" min-width="100" show-overflow-tooltip />
      <el-table-column prop="create_time" label="添加时间" width="165" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" width="165" sortable="custom" />
      <el-table-column label="操作" width="95">
        <template #default="scope">
          <el-link type="primary" class="mr-1" :underline="false" @click="edit(scope.row)"> 修改 </el-link>
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
    <!-- 添加修改 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      top="5vh"
    >
      <el-scrollbar native :height="height - 30">
        <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
          <el-form-item label="会员ID" prop="member_id">
            <el-col :span="8">
              <el-input v-model="model.member_id" placeholder="请输入会员ID" clearable />
            </el-col>
            <el-col class="text-center" :span="4">会员用户名</el-col>
            <el-col :span="12">
              <el-input v-model="model.member_username" placeholder="" disabled />
            </el-col>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="model.type">
              <el-option v-for="(item, index) in types" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="model.title" placeholder="请输入标题" clearable />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input v-model="model.content" type="textarea" autosize placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="图片" prop="images">
            <FileUploads v-model="model.images" upload-btn="上传图片" file-type="image" file-tip="图片文件" />
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="model.phone" placeholder="" clearable />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="model.email" placeholder="" clearable />
          </el-form-item>
          <el-form-item label="回复" prop="reply">
            <el-input v-model="model.reply" type="textarea" autosize placeholder="请输入回复" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="model.status">
              <el-option v-for="(item, index) in statuss" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="model.remark" placeholder="" clearable />
          </el-form-item>
          <el-form-item label="回执" prop="receipt_no">
            <el-input v-model="model.receipt_no" placeholder="回执编号（唯一）" clearable />
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
            <el-input v-model="model.create_time" disabled />
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
            <el-input v-model="model.update_time" disabled />
          </el-form-item>
          <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
            <el-input v-model="model.delete_time" disabled />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import { arrayColumn } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import { list, info, add, edit, dele, status as editsta, disable } from '@/api/setting/feedback'

export default {
  name: 'SettingFeedback',
  components: { Pagination },
  data() {
    return {
      name: '反馈',
      height: 680,
      loading: false,
      idkey: 'feedback_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'title',
        search_exp: 'like',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        feedback_id: '',
        member_id: 0,
        member_username: '',
        receipt_no: '',
        type: 0,
        title: '',
        content: '',
        images: [],
        phone: '',
        email: '',
        reply: '',
        remark: '',
        status: 0
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      types: [],
      statuss: [],
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: '',
      status: 0,
      is_disable: 0
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
      list(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.types = res.data.types
          this.statuss = res.data.statuss
          this.exps = res.data.exps
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 添加修改
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id)
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
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.model[this.idkey]) {
            edit(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            add(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        try {
          this.$refs['ref'].resetFields()
          this.$refs['ref'].clearValidate()
        } catch (error) {}
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
        if (selectType === 'status') {
          this.selectTitle = this.name + '状态'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
        } else if (selectType === 'dele') {
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
        if (selectType === 'status') {
          this.editsta(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 状态
    editsta(row, select) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var status = row[0].status
        if (select) {
          status = this.status
        }
        editsta({
          ids: this.selectGetIds(row),
          status: status
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 是否禁用
    disable(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_disable = row[0].is_disable
        if (select) {
          is_disable = this.is_disable
        }
        disable({
          ids: this.selectGetIds(row),
          is_disable: is_disable
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
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
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
