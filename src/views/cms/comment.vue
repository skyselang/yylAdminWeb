<template>
  <div class="app-container">
    <!-- 查询、选中操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="call" label="称呼" />
            <el-option value="mobile" label="手机" />
            <el-option value="title" label="标题" />
            <el-option value="is_unread" label="是否未读" />
            <el-option value="comment_id" label="ID" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
            <el-option value="read_time" label="已读时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="filter-item ya-date-value"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button @click="isread(selection,true)">已读</el-button>
          <el-button @click="dele(selection)">删除</el-button>
          <el-button @click="recover()">回收站</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="data" :height="height" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="comment_id" label="ID" min-width="100" sortable="custom" />
      <el-table-column prop="call" label="称呼" min-width="100" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机" min-width="120" sortable="custom" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="100" show-overflow-tooltip />
      <el-table-column prop="is_unread" label="未读" min-width="80" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_unread" :active-value="1" :inactive-value="0" @change="isread([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" min-width="85" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" title="修改" @click="edit(row)">查看</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="称呼" prop="call">
          <el-input v-model="model.call" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="model.mobile" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="model.tel" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="model.email" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="model.qq" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="model.wechat" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="model.content" type="textarea" placeholder="" clearable :autosize="{minRows:3,maxRows:20}" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" placeholder="" clearable />
        </el-form-item>
        <el-form-item v-if="model.comment_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.comment_id" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
          <el-input v-model="model.delete_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.comment_id" label="已读时间" prop="read_time">
          <el-input v-model="model.read_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 回收站 -->
    <el-dialog :title="recoverDialogTitle" :visible.sync="recoverDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 回收站查询、选中操作 -->
      <div class="filter-container">
        <el-row>
          <el-col>
            <el-select v-model="recoverQuery.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
              <el-option value="call" label="称呼" />
              <el-option value="mobile" label="手机" />
              <el-option value="title" label="标题" />
              <el-option value="comment_id" label="ID" />
              <el-option value="is_unread" label="是否未读" />
            </el-select>
            <el-input v-model="recoverQuery.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
            <el-select v-model="recoverQuery.date_field" class="filter-item ya-date-field" placeholder="时间类型" clearable>
              <el-option value="create_time" label="添加时间" />
              <el-option value="delete_time" label="删除时间" />
              <el-option value="read_time" label="已读时间" />
            </el-select>
            <el-date-picker
              v-model="recoverQuery.date_value"
              type="daterange"
              class="filter-item ya-date-value"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-button class="filter-item" type="primary" @click="recoverSearch()">查询</el-button>
            <el-button class="filter-item" @click="recoverRefresh()">刷新</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button @click="recoverReco(recoverSelection)">恢复</el-button>
            <el-button @click="recoverDele(recoverSelection)">删除</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 回收站列表 -->
      <el-table ref="recoverRef" v-loading="recoverLoad" :data="recoverData" :height="height" @sort-change="recoverSort" @selection-change="recoverSelect">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="comment_id" label="ID" min-width="80" sortable="custom" />
        <el-table-column prop="call" label="称呼" min-width="100" show-overflow-tooltip />
        <el-table-column prop="mobile" label="手机" min-width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" min-width="100" show-overflow-tooltip />
        <el-table-column prop="is_unread" label="未读" min-width="80" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_unread" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
        <el-table-column prop="delete_time" label="删除时间" min-width="155" sortable="custom" />
        <el-table-column label="操作" min-width="85" align="right" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="text" @click="recoverReco([row])">恢复</el-button>
            <el-button size="mini" type="text" @click="recoverDele([row])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 回收站分页 -->
      <pagination v-show="recoverCount > 0" :total="recoverCount" :page.sync="recoverQuery.page" :limit.sync="recoverQuery.limit" @pagination="recoverList" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, isread, recover, recoverReco, recoverDele } from '@/api/cms/comment'

export default {
  name: 'CmsComment',
  components: { Pagination },
  directives: { },
  data() {
    return {
      name: '留言',
      height: 680,
      loading: false,
      query: {
        page: 1,
        limit: 15,
        search_field: 'call',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        comment_id: '',
        call: '',
        mobile: '',
        tel: '',
        email: '',
        qq: '',
        wechat: '',
        title: '',
        content: '',
        remark: ''
      },
      selection: [],
      rules: {
        call: [{ required: true, message: '请输入称呼', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      recoverDialog: false,
      recoverDialogTitle: '',
      recoverLoad: false,
      recoverData: [],
      recoverCount: 0,
      recoverQuery: {
        page: 1,
        limit: 15,
        search_field: 'call',
        date_field: 'delete_time'
      },
      recoverSelection: []
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
      this.model = this.$options.data().model
    },
    edit(row) {
      this.loading = true
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.comment_id
      info({
        comment_id: row.comment_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
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
          if (this.model.comment_id) {
            edit(this.model).then(res => {
              this.dialog = false
              this.list()
              this.reset()
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.dialog = false
              this.list()
              this.reset()
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
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].comment_id
          message = '确定要删除' + this.name + ' <span style="color:red">' + row[0].title + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            ids: arrayColumn(row, 'comment_id')
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
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
        this.$refs['ref'].clearValidate()
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
    // 已读
    isread(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        isread({
          ids: arrayColumn(row, 'comment_id')
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 回收站
    recover() {
      this.recoverDialog = true
      this.recoverDialogTitle = this.name + '回收站'
      this.recoverList()
    },
    // 回收站查询
    recoverSearch() {
      this.recoverQuery.page = 1
      this.recoverList()
    },
    // 回收站刷新
    recoverRefresh() {
      this.recoverQuery = this.$options.data().recoverQuery
      this.recoverList()
    },
    // 回收站列表
    recoverList() {
      this.recoverLoad = true
      recover(this.recoverQuery).then(res => {
        this.recoverData = res.data.list
        this.recoverCount = res.data.count
        this.recoverLoad = false
      }).catch(() => {
        this.recoverLoad = false
      })
    },
    // 回收站排序
    recoverSort(sort) {
      this.recoverQuery.sort_field = sort.prop
      this.recoverQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.recoverQuery.sort_value = 'asc'
        this.recoverList()
      }
      if (sort.order === 'descending') {
        this.recoverQuery.sort_value = 'desc'
        this.recoverList()
      }
    },
    // 回收站恢复
    recoverReco(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '恢复' + this.name
        var message = '确定要恢复选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].comment_id
          message = '确定要恢复' + this.name + ' <span style="color:red">' + row[0].title + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.recoverLoad = true
          recoverReco({
            ids: arrayColumn(row, 'comment_id')
          }).then(res => {
            this.list()
            this.recoverList()
            this.$message.success(res.msg)
          }).catch(() => {
            this.recoverLoad = false
          })
        }).catch(() => {})
      }
    },
    // 回收站删除
    recoverDele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要彻底删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].comment_id
          message = '确定要彻底删除' + this.name + ' <span style="color:red">' + row[0].title + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.recoverLoad = true
          recoverDele({
            ids: arrayColumn(row, 'comment_id')
          }).then(res => {
            this.recoverList()
            this.$message.success(res.msg)
          }).catch(() => {
            this.recoverLoad = false
          })
        }).catch(() => {})
      }
    },
    // 回收站选择
    recoverSelect(selection) {
      this.recoverSelection = selection
    }
  }
}
</script>
