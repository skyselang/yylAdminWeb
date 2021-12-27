<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row>
        <el-col class="ya-margin-bottom">
          <el-select v-model="query.search_field" class="ya-search-field" placeholder="搜索字段">
            <el-option value="title" label="标题" />
            <el-option value="admin_user" label="添加用户" />
            <el-option value="admin_user_id" label="用户ID" />
            <el-option value="admin_message_id" label="ID" />
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
          <el-button @click="dele(selection)">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog title="选中操作" :visible.sync="selectDialog" top="20vh">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item v-if="selectType==='isopen'" label="开启" prop="">
            <el-switch v-model="is_open" :active-value="1" :inactive-value="0" />
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
      <el-table-column prop="admin_message_id" label="ID" min-width="100" sortable="custom" />
      <el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="{'color':scope.row.color}">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_open" label="开启" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_open" :active-value="1" :inactive-value="0" @change="isopen([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="open_time_start" label="开始时间" min-width="160" sortable="custom" />
      <el-table-column prop="open_time_end" label="结束时间" min-width="160" sortable="custom" />
      <el-table-column prop="sort" label="排序" min-width="80" sortable="custom" />
      <el-table-column prop="admin_user" label="添加用户" min-width="120" show-overflow-tooltip />
      <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" min-width="90" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :model="model" :rules="rules" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="model.color" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" />
        </el-form-item>
        <el-form-item label="开启" prop="is_open">
          <el-switch v-model="model.is_open" :active-value="1" :inactive-value="0" />
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
        <el-form-item v-if="model.admin_message_id" label="用户" prop="admin_user">
          <el-input v-model="model.admin_user" disabled />
        </el-form-item>
        <el-form-item v-if="model.admin_message_id" label="用户ID" prop="admin_user_id">
          <el-input v-model="model.admin_user_id" disabled />
        </el-form-item>
        <el-form-item v-if="model.admin_message_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.admin_message_id" label="修改时间" prop="update_time">
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
import { list, info, add, edit, dele, isopen } from '@/api/admin/message'

export default {
  name: 'AdminSystemMessage',
  components: { Pagination, RichEditor },
  data() {
    return {
      name: '消息',
      height: 680,
      loading: false,
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
        admin_message_id: '',
        admin_user_id: 0,
        admin_user: '',
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
      selectDialog: false,
      selectType: '',
      is_open: 0
    }
  },
  created() {
    this.height = screenHeight(280)
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
    // 添加、修改
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.admin_message_id
      info({
        admin_message_id: row.admin_message_id
      }).then(res => {
        this.model = res.data
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
          if (this.model.admin_message_id) {
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
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '记录吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].admin_message_id
          message = '确定要删除' + this.name + ' <span style="color:red">' + row[0].title + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            list: row
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
    },
    // 重置
    reset() {
      this.model = this.$options.data().model
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
    },
    selectAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => {} })
    },
    selectOpen(selectType) {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
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
        const type = this.selectType
        if (type === 'isopen') {
          this.isopen(this.selection, true)
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
          list: row,
          is_open: is_open
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
        })
      }
    }
  }
}
</script>
