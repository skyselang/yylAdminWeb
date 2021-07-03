<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="20">
          <el-input v-model="query.comment_id" class="filter-item" style="width: 110px;" placeholder="ID" clearable />
          <el-input v-model="query.keyword" class="filter-item" style="width: 200px;" placeholder="称呼/手机/标题" clearable />
          <el-select v-model="query.is_read" class="filter-item" style="width:80px;" placeholder="阅读" clearable>
            <el-option value="0" label="未读" />
            <el-option value="1" label="已读" />
          </el-select>
          <el-select v-model="query.date_type" class="filter-item" style="width:110px;" placeholder="时间类型" clearable>
            <el-option value="create_time" label="添加时间" />
            <el-option value="read_time" label="阅读时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_range"
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
          <el-button class="filter-item" @click="recover()">回收站</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="data" :height="height-50" style="width: 100%" border @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="comment_id" label="ID" min-width="80" sortable="custom" />
      <el-table-column prop="call" label="称呼" min-width="100" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="100" show-overflow-tooltip />
      <el-table-column prop="is_read" label="未读" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_read" :active-value="0" :inactive-value="1" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" min-width="145" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="success" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button size="mini" @click="isread(selection,true)">已读</el-button>
      <el-button size="mini" type="danger" @click="dele(selection)">删除</el-button>
    </div>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" width="50%" top="1vh" :before-close="cancel" @close-on-click-modal="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="称呼" prop="call">
          <el-input v-model="model.call" clearable placeholder="" disabled />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="model.mobile" clearable placeholder="" disabled />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="model.tel" clearable placeholder="" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="model.email" clearable placeholder="" disabled />
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="model.qq" clearable placeholder="" disabled />
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="model.wechat" clearable placeholder="" disabled />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" clearable placeholder="" disabled />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="model.content" type="textarea" clearable placeholder="" disabled />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" clearable placeholder="" />
        </el-form-item>
        <el-form-item v-if="model.comment_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.comment_id" label="已读时间" prop="read_time">
          <el-input v-model="model.read_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.comment_id" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
          <el-input v-model="model.delete_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 回收站 -->
    <el-dialog :title="recoverDialogTitle" :visible.sync="recoverDialog" width="80%" top="1vh">
      <div class="filter-container">
        <el-row :gutter="0">
          <el-col :xs="24" :sm="24">
            <el-input v-model="recoverQuery.comment_id" class="filter-item" style="width: 110px;" placeholder="ID" clearable />
            <el-input v-model="recoverQuery.keyword" class="filter-item" style="width: 200px;" placeholder="称呼/手机/标题" clearable />
            <el-select v-model="recoverQuery.is_read" class="filter-item" style="width:80px;" placeholder="阅读" clearable>
              <el-option value="0" label="未读" />
              <el-option value="1" label="已读" />
            </el-select>
            <el-select v-model="recoverQuery.date_type" class="filter-item" style="width:110px;" placeholder="时间类型" clearable>
              <el-option value="create_time" label="添加时间" />
              <el-option value="read_time" label="阅读时间" />
              <el-option value="update_time" label="修改时间" />
              <el-option value="delete_time" label="删除时间" />
            </el-select>
            <el-date-picker
              v-model="recoverQuery.date_range"
              type="daterange"
              class="filter-item"
              style="width: 240px;"
              range-separator="-"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-button class="filter-item" type="primary" @click="recoverSearch()">查询</el-button>
            <el-button class="filter-item" @click="recoverRefresh()">刷新</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table ref="recoverRef" v-loading="recoverLoad" :data="recoverData" :height="height-60" style="width: 100%" border @sort-change="recoverSort" @selection-change="recoverSelect">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="comment_id" label="ID" min-width="80" sortable="custom" />
        <el-table-column prop="call" label="称呼" min-width="100" show-overflow-tooltip />
        <el-table-column prop="mobile" label="手机" min-width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" min-width="100" show-overflow-tooltip />
        <el-table-column prop="is_read" label="未读" min-width="80" sortable="custom" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_read" :active-value="0" :inactive-value="1" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
        <el-table-column prop="delete_time" label="删除时间" min-width="155" sortable="custom" />
        <el-table-column label="操作" min-width="145" align="right" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="success" @click="recoverReco([row])">恢复</el-button>
            <el-button size="mini" type="danger" @click="recoverDele([row])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button size="mini" type="success" @click="recoverReco(recoverSelection)">恢复</el-button>
        <el-button size="mini" type="danger" @click="recoverDele(recoverSelection)">删除</el-button>
      </div>
      <pagination v-show="recoverCount > 0" :total="recoverCount" :page.sync="recoverQuery.page" :limit.sync="recoverQuery.limit" @pagination="recoverList" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { getAdminToken } from '@/utils/auth'
import { list, info, edit, dele, isread, recover, recoverReco, recoverDele } from '@/api/comment'

export default {
  name: 'Comment',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      name: '留言',
      height: 680,
      loading: false,
      query: {
        page: 1,
        limit: 12
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        comment_id: '',
        name: '',
        url: '',
        imgs: [],
        sort: 200
      },
      selection: [],
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/Comment/upload',
      uploadHeaders: { AdminToken: getAdminToken() },
      uploadData: { type: 'image' },
      rules: {},
      recoverDialog: false,
      recoverDialogTitle: '',
      recoverLoad: false,
      recoverData: [],
      recoverCount: 0,
      recoverQuery: {
        page: 1,
        limit: 10
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
    // 选择
    select(selection) {
      this.selection = selection
    },
    selectAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { confirmButtonText: '确定', callback: action => {} })
    },
    // 添加
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.model = this.$options.data().model
    },
    // 修改
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
    // 删除
    dele(row) {
      if (row.length === 0) {
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
            comment: row
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
    },
    // 取消
    cancel() {
      this.reset()
      this.dialog = false
    },
    // 提交
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
          }
        }
      })
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
        if (this.model.comment_category_id === 0) {
          this.model.comment_category_id = ''
        }
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
      this.query.sort_type = ''
      if (sort.order === 'ascending') {
        this.query.sort_type = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_type = 'desc'
        this.list()
      }
    },
    // 已读
    isread(row, select = false) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        this.loading = true
        isread({
          comment: row
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
        this.$nextTick(() => {
          this.$refs['recoverRef'].doLayout()
        })
      }).catch(() => {
        this.recoverLoad = false
      })
    },
    // 回收站排序
    recoverSort(sort) {
      this.recoverQuery.sort_field = sort.prop
      this.recoverQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.recoverQuery.sort_type = 'asc'
        this.recoverList()
      }
      if (sort.order === 'descending') {
        this.recoverQuery.sort_type = 'desc'
        this.recoverList()
      }
    },
    // 回收站恢复
    recoverReco(row) {
      if (row.length === 0) {
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
            comment: row
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
      if (row.length === 0) {
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
            comment: row
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
    },
    // 回收站父级选择（查询）
    recoverPidChangeQuery(value) {
      if (value) {
        this.recoverQuery.comment_category_id = value[value.length - 1]
      }
    }
  }
}
</script>
