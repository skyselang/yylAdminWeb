<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col class="ya-margin-bottom">
          <el-select v-model="query.search_field" class="ya-search-field" placeholder="搜索字段">
            <el-option value="title" label="标题" />
            <el-option value="username" label="添加用户" />
            <el-option value="admin_user_id" label="添加用户ID" />
            <el-option value="is_open" label="是否开启" />
            <el-option :value="idkey" label="ID" />
          </el-select>
          <el-input v-model="query.search_value" class="ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="ya-search-field" placeholder="时间字段">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
            <el-option value="open_time_start" label="开始时间" />
            <el-option value="open_time_end" label="结束时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="ya-date-value"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button type="primary" @click="search()">查询</el-button>
          <el-button @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button @click="selectOpen('isopen')">开启</el-button>
          <el-button @click="selectOpen('opentime')">时间</el-button>
          <el-button @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :rows="2" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='isopen'" label="开启" prop="">
            <el-switch v-model="is_open" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='opentime'" label="开启时间" prop="">
            <el-date-picker v-model="open_time_start" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="开始时间" />
            <span>至</span>
            <el-date-picker v-model="open_time_end" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59" placeholder="结束时间" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='dele'" label="" prop="">
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
      <el-table-column prop="title" label="标题" min-width="260" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="{'color':scope.row.color}">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_open" label="开启" min-width="80" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_open" :active-value="1" :inactive-value="0" @change="isopen([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="open_time_start" label="开始时间" min-width="160" sortable="custom" />
      <el-table-column prop="open_time_end" label="结束时间" min-width="160" sortable="custom" />
      <el-table-column prop="sort" label="排序" min-width="80" sortable="custom" />
      <el-table-column prop="username" label="添加用户" min-width="120" show-overflow-tooltip />
      <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" min-width="90" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="标题颜色" prop="color">
          <el-color-picker v-model="model.color" />
        </el-form-item>
        <el-form-item label="开启" prop="is_open">
          <el-switch v-model="model.is_open" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" />
        </el-form-item>
        <el-form-item label="开始时间" prop="open_time_start">
          <el-date-picker v-model="model.open_time_start" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="开启开始时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="open_time_end">
          <el-date-picker v-model="model.open_time_end" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59" placeholder="开启结束时间" />
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="model.intro" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <rich-editor v-model="model.content" />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="用户" prop="username">
          <el-input v-model="model.username" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="用户ID" prop="admin_user_id">
          <el-input v-model="model.admin_user_id" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import RichEditor from '@/components/RichEditor'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, isopen, opentime } from '@/api/admin/notice'

export default {
  name: 'AdminSystemNotice',
  components: { Pagination, RichEditor },
  data() {
    return {
      name: '公告',
      height: 680,
      loading: false,
      idkey: 'admin_notice_id',
      query: {
        page: 1,
        limit: 15,
        search_field: 'title',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        admin_notice_id: '',
        admin_user_id: 0,
        username: '',
        title: '',
        color: '#606266',
        type: 1,
        sort: 250,
        is_open: 1,
        open_time_start: '',
        open_time_end: '',
        intro: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        open_time_start: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
        open_time_end: [{ required: true, message: '请输入结束时间', trigger: 'blur' }]
      },
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      is_open: 0,
      open_time_start: '',
      open_time_end: ''
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
      info(id).then(res => {
        this.reset(res.data)
      })
    },
    cancel() {
      this.reset()
      this.dialog = false
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.admin_notice_id) {
            edit(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
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
        this.$refs['ref'].resetFields()
      }
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
        if (selectType === 'isopen') {
          this.selectTitle = '是否开启'
        } else if (selectType === 'opentime') {
          this.selectTitle = '开启时间'
        } else if (selectType === 'dele') {
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
        if (selectType === 'isopen') {
          this.isopen(this.selection, true)
        } else if (selectType === 'opentime') {
          this.opentime(this.selection)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 是否开启
    isopen(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_open = row[0].is_open
        if (select) {
          is_open = this.is_open
        }
        isopen({
          ids: this.selectGetIds(row),
          is_open: is_open
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
        })
      }
    },
    // 开启时间
    opentime(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        opentime({
          ids: this.selectGetIds(row),
          open_time_start: this.open_time_start,
          open_time_end: this.open_time_end
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
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
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>
