<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option :value="idkey" label="ID" />
            <el-option value="dept_pid" label="上级" />
            <el-option value="dept_name" label="名称" />
            <el-option value="dept_abbr" label="简称" />
            <el-option value="dept_desc" label="描述" />
            <el-option value="remark" label="备注" />
            <el-option value="is_disable" label="禁用" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-cascader v-if="query.search_field==='dept_pid'" v-model="query.search_value" :options="trees" :props="props" class="filter-item ya-search-value" clearable filterable />
          <el-select v-else-if="query.search_field==='is_disable'" v-model="query.search_value" class="filter-item ya-search-value">
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="查询内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker v-model="query.date_value" type="datetimerange" class="filter-item ya-date-value" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00','23:59:59']" value-format="yyyy-MM-dd HH:mm:ss" />
          <el-button class="filter-item" type="primary" title="查询/刷新" @click="search()">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" title="重置" @click="refresh()" />
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-checkbox v-model="isExpandAll" style="margin-right:10px;top:-2px" border title="收起/展开" @change="expandAll">收起</el-checkbox>
          <el-button title="解除用户" @click="selectOpen('removeu')">用户</el-button>
          <el-button title="修改上级" @click="selectOpen('editpid')">上级</el-button>
          <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 5, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='removeu'" label="" prop="">
            <span style="">确定要解除选中的{{ name }}的用户吗？</span>
          </el-form-item>
          <el-form-item v-else-if="selectType==='editpid'" label="上级" prop="">
            <el-cascader v-model="dept_pid" :options="trees" :props="props" style="width:100%" placeholder="一级部门" clearable filterable />
          </el-form-item>
          <el-form-item v-if="selectType==='disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='dele'" label="" prop="">
            <span style="color:red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="loading" @click="selectCancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height+50" :row-key="idkey" default-expand-all @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="dept_name" label="名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="dept_abbr" label="简称" min-width="100" />
      <el-table-column prop="dept_desc" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column :prop="idkey" label="ID" min-width="80" />
      <el-table-column prop="is_disable" label="禁用" min-width="75">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="75" />
      <el-table-column prop="create_time" label="添加时间" width="155" />
      <el-table-column prop="update_time" label="修改时间" width="155" />
      <el-table-column label="操作" width="155">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="userShow(scope.row)">用户</el-button>
          <el-button size="mini" type="text" title="添加下级" @click="add(scope.row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-descriptions title="" :column="12" :colon="false" size="medium">
        <el-descriptions-item label="">共 {{ count }} 条</el-descriptions-item>
      </el-descriptions>
    </el-row>
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="上级" prop="dept_pid">
          <el-cascader v-model="model.dept_pid" :options="trees" :props="props" style="width:100%" placeholder="一级部门" clearable filterable />
        </el-form-item>
        <el-form-item label="名称" prop="dept_name">
          <el-input v-model="model.dept_name" placeholder="请输入部门名称" clearable />
        </el-form-item>
        <el-form-item label="简称" prop="dept_abbr">
          <el-input v-model="model.dept_abbr" placeholder="请输入部门简称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="dept_desc">
          <el-input v-model="model.dept_desc" type="textarea" autosize placeholder="请输入部门描述" clearable />
        </el-form-item>
        <el-form-item label="电话" prop="dept_tel">
          <el-input v-model="model.dept_tel" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="传真" prop="dept_fax">
          <el-input v-model="model.dept_fax" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="dept_email">
          <el-input v-model="model.dept_email" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="地址" prop="dept_addr">
          <el-input v-model="model.dept_addr" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" placeholder="250" clearable />
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
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 部门用户 -->
    <el-dialog :title="userDialogTitle" :visible.sync="userDialog" width="70%" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button type="primary" title="解除" @click="userSelectOpen('userRemove')">解除</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="userSelectTitle" :visible.sync="userSelectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
        <el-form ref="userSelectRef" label-width="120px">
          <el-form-item :label="userName+'ID'" prop="">
            <el-input v-model="userSelectIds" type="textarea" :autosize="{minRows: 5, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="userSelectType==='userRemove'" label="部门ID" prop="">
            <span>{{ userQuery[idkey] }}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="userSelectCancel">取消</el-button>
          <el-button type="primary" @click="userSelectSubmit">提交</el-button>
        </div>
      </el-dialog>
      <!-- 用户列表 -->
      <el-table ref="userRef" v-loading="userLoad" :data="userData" :height="height-20" @sort-change="userSort" @selection-change="userSelect">
        <el-table-column type="selection" width="42" title="全选/反选" />
        <el-table-column :prop="userPk" label="用户ID" min-width="80" sortable="custom" />
        <el-table-column prop="nickname" label="昵称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="username" label="账号" min-width="120" show-overflow-tooltip />
        <el-table-column prop="dept_names" label="部门" min-width="120" show-overflow-tooltip />
        <el-table-column prop="is_super" label="超管" min-width="75" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_super" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_disable" label="禁用" min-width="75" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="100" show-overflow-tooltip />
        <el-table-column label="操作" min-width="75">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="userSelectOpen('userRemove',scope.row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="userCount>0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="user" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, editpid, disable, user, userRemove } from '@/api/system/dept'

export default {
  name: 'SystemDept',
  components: { Pagination },
  directives: {},
  data() {
    return {
      name: '部门',
      height: 680,
      loading: false,
      idkey: 'dept_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: { search_field: 'dept_name', search_exp: 'like', date_field: 'create_time' },
      data: [],
      dialog: false,
      dialogTitle: '',
      model: {
        dept_id: '',
        dept_pid: 0,
        dept_name: '',
        dept_abbr: '',
        dept_desc: '',
        dept_tel: '',
        dept_fax: '',
        dept_email: '',
        dept_addr: '',
        remark: '',
        sort: 250
      },
      rules: {
        dept_name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      trees: [],
      props: { checkStrictly: true, value: 'dept_id', label: 'dept_name', emitPath: false },
      isExpandAll: false,
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      dept_pid: '',
      is_disable: 0,
      userPk: 'user_id',
      userName: '用户',
      userDialog: false,
      userDialogTitle: '',
      userLoad: false,
      userData: [],
      userCount: 0,
      userQuery: { page: 1, limit: 12 },
      userSelection: [],
      userSelectIds: '',
      userSelectTitle: '选中操作',
      userSelectDialog: false,
      userSelectType: '',
      count: ''
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
        this.trees = res.data.tree
        this.exps = res.data.exps
        this.count = res.data.count
        this.isExpandAll = false
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加修改
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
      if (row) {
        this.model.dept_pid = row[this.idkey]
      }
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.reset(res.data)
      }).catch(() => { })
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model[this.idkey]) {
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
        this.$refs['ref'].clearValidate()
      }
    },
    // 查询
    search() {
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
    // 收起/展开
    expandAll(e) {
      this.expandFor(this.data, !e)
    },
    expandFor(data, isExpand) {
      data.forEach(i => {
        this.$refs.table.toggleRowExpansion(i, isExpand)
        if (i.children) {
          this.expandFor(i.children, isExpand)
        }
      })
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
        if (selectType === 'removeu') {
          this.selectTitle = this.name + '解除用户'
        } else if (selectType === 'editpid') {
          this.selectTitle = this.name + '修改上级'
        } else if (selectType === 'disable') {
          this.selectTitle = 'this.name + 是否禁用'
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
        if (selectType === 'removeu') {
          this.removeu(this.selection)
        } else if (selectType === 'editpid') {
          this.editpid(this.selection)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 解除用户
    removeu(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        userRemove({
          dept_id: this.selectGetIds(row),
          user_ids: []
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修改上级
    editpid(row) {
      editpid({
        ids: this.selectGetIds(row),
        dept_pid: this.dept_pid
      }).then(res => {
        this.list()
        this.selectDialog = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 是否禁用
    disable(row, select = false) {
      if (row.length === 0) {
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
    // 部门用户显示
    userShow(row) {
      this.userDialog = true
      this.userDialogTitle = this.name + '用户：' + row.dept_name
      this.userQuery.dept_id = row.dept_id
      this.user()
    },
    // 部门用户列表
    user() {
      this.userLoad = true
      user(this.userQuery).then(res => {
        this.userData = res.data.list
        this.userCount = res.data.count
        this.userLoad = false
      }).catch(() => {
        this.userLoad = false
      })
    },
    // 部门用户排序
    userSort(sort) {
      this.userQuery.sort_field = sort.prop
      this.userQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.userQuery.sort_value = 'asc'
        this.user()
      }
      if (sort.order === 'descending') {
        this.userQuery.sort_value = 'desc'
        this.user()
      }
    },
    // 部门用户选中操作
    userSelect(selection) {
      this.userSelection = selection
      this.userSelectIds = this.userSelectGetIds(selection).toString()
    },
    userSelectGetIds(selection) {
      return arrayColumn(selection, this.userPk)
    },
    userSelectAlert() {
      this.$alert('请选择需要操作的' + this.userName, '提示', { type: 'warning', callback: action => { } })
    },
    userSelectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['userRef'].clearSelection()
        this.$refs['userRef'].toggleRowSelection(selectRow)
      }
      if (!this.userSelection.length) {
        this.userSelectAlert()
      } else {
        this.userSelectTitle = '选中操作'
        if (selectType === 'userRemove') {
          this.userSelectTitle = '解除' + this.name
        }
        this.userSelectDialog = true
        this.userSelectType = selectType
      }
    },
    userSelectCancel() {
      this.userSelectDialog = false
    },
    userSelectSubmit() {
      if (!this.userSelection.length) {
        this.userSelectAlert()
      } else {
        const selectType = this.userSelectType
        if (selectType === 'userRemove') {
          this.userRemove(this.userSelection)
        }
        this.userSelectDialog = false
      }
    },
    // 部门用户解除
    userRemove(row) {
      if (!row.length) {
        this.userSelectAlert()
      } else {
        this.userLoad = true
        userRemove({
          dept_id: this.userQuery.dept_id,
          user_ids: this.userSelectGetIds(row)
        }).then(res => {
          this.user()
          this.$message.success(res.msg)
        }).catch(() => {
          this.userLoad = false
        })
      }
    }
  }
}
</script>
