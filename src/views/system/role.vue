<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option :value="idkey" label="ID" />
            <el-option value="role_name" label="名称" />
            <el-option value="role_desc" label="描述" />
            <el-option value="is_disable" label="禁用" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-select v-if="query.search_field==='is_disable'" v-model="query.search_value" class="filter-item ya-search-value">
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="查询内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker v-model="query.date_value" type="daterange" class="filter-item ya-date-value" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
          <el-button class="filter-item" type="primary" title="查询/刷新" @click="search()">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" title="重置" @click="refresh()" />
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button title="解除用户" @click="selectOpen('removeu')">用户</el-button>
          <el-button title="修改菜单" @click="selectOpen('editmenu')">菜单</el-button>
          <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px" class="dialog-body" :style="{height:height-200+'px'}">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 5, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='removeu'" label="" prop="">
            <span style="">确定要解除选中的{{ name }}的用户吗？</span>
          </el-form-item>
          <el-form-item v-else-if="selectType==='editmenu'" label="菜单" prop="">
            <span>
              <el-checkbox v-model="menuExpandAll" title="展开/收起" @change="menuExpandAllChange('selMenuRef')">展开</el-checkbox>
              <el-checkbox v-model="menuCheckAll" title="全选/反选" @change="menuCheckAllChange('selMenuRef')">全选</el-checkbox>
            </span>
            <el-tree ref="selMenuRef" :data="menuData" :props="menuProps" :default-checked-keys="menu_ids" node-key="menu_id" show-checkbox check-strictly :expand-on-click-node="false" @check="apiCheck('selMenuRef')">
              <span slot-scope="scope" class="custom-tree-node">
                <span>{{ scope.node.label }}</span>
                <span v-if="scope.data.children" style="margin-left:10px">
                  <el-checkbox title="全选/反选" @change="menuCheckAllChangePid(scope.node, scope.data, 'selMenuRef')">全选</el-checkbox>
                </span>
                <span>
                  <i v-if="scope.data.api_url" class="el-icon-link" style="margin-left:10px" :title="scope.data.api_url" />
                  <i v-else class="el-icon-link" style="margin-left:10px;color:#fff" />
                  <i v-if="scope.data.is_unlogin" class="el-icon-user" style="margin-left:10px" title="免登" />
                  <i v-else class="el-icon-user" style="margin-left:10px;color:#fff" />
                  <i v-if="scope.data.is_unauth" class="el-icon-unlock" style="margin-left:10px" title="免权" />
                  <i v-else class="el-icon-unlock" style="margin-left:10px;color:#fff" />
                </span>
              </span>
            </el-tree>
          </el-form-item>
          <el-form-item v-else-if="selectType==='disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
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
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="role_name" label="名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="role_desc" label="描述" min-width="150" show-overflow-tooltip />
      <el-table-column prop="is_disable" label="禁用" min-width="80" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="80" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="userShow(scope.row)">用户</el-button>
          <el-button size="mini" type="text" @click="edit(scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count>0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="名称" prop="role_name">
          <el-input v-model="model.role_name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="role_desc">
          <el-input v-model="model.role_desc" placeholder="请输入描述" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort" placeholder="250">
          <el-input v-model="model.sort" type="number" />
        </el-form-item>
        <el-form-item label="菜单">
          <span>
            <el-checkbox v-model="menuExpandAll" title="展开/收起" @change="menuExpandAllChange('menuRef')">展开</el-checkbox>
            <el-checkbox v-model="menuCheckAll" title="全选/反选" @change="menuCheckAllChange('menuRef')">全选</el-checkbox>
          </span>
          <el-tree ref="menuRef" :data="menuData" :props="menuProps" :default-checked-keys="model.menu_ids" :node-key="menuIdkey" show-checkbox check-strictly :expand-on-click-node="false" @check="menuCheck('menuRef')">
            <span slot-scope="scope" class="custom-tree-node">
              <span>{{ scope.node.label }}</span>
              <span v-if="scope.data.children" style="margin-left:10px">
                <el-checkbox title="全选/反选" @change="menuCheckAllChangePid(scope.node, scope.data, 'menuRef')">全选</el-checkbox>
              </span>
              <span>
                <i v-if="scope.data.menu_url" class="el-icon-link" style="margin-left:10px" :title="scope.data.menu_url" />
                <i v-else class="el-icon-link" style="margin-left:10px;color:#fff" />
                <i v-if="scope.data.is_unlogin" class="el-icon-user" style="margin-left:10px" title="免登" />
                <i v-else class="el-icon-user" style="margin-left:10px;color:#fff" />
                <i v-if="scope.data.is_unauth" class="el-icon-unlock" style="margin-left:10px" title="免权" />
                <i v-else class="el-icon-unlock" style="margin-left:10px;color:#fff" />
              </span>
            </span>
          </el-tree>
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
    <!-- 用户 -->
    <el-dialog :title="userDialogTitle" :visible.sync="userDialog" width="65%" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button type="primary" title="解除" @click="userSelectOpen('userRemove')">解除</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table ref="userRef" v-loading="userLoad" :data="userData" :height="height-20" @sort-change="userSort" @selection-change="userSelect">
        <el-table-column type="selection" width="42" title="全选/反选" />
        <el-table-column prop="user_id" label="用户ID" width="100" sortable="custom" />
        <el-table-column prop="nickname" label="昵称" min-width="130" show-overflow-tooltip />
        <el-table-column prop="username" label="账号" min-width="130" show-overflow-tooltip />
        <el-table-column prop="role_names" label="角色" min-width="130" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" min-width="100" show-overflow-tooltip />
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
        <el-table-column label="操作" width="75">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="userSelectOpen('userRemove',scope.row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="userCount>0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="userList" />
    </el-dialog>
    <el-dialog :title="userSelectTitle" :visible.sync="userSelectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="userSelectRef" label-width="120px">
        <el-form-item :label="userName+'ID'" prop="">
          <el-input v-model="userSelectIds" type="textarea" :autosize="{minRows: 5, maxRows: 12}" disabled />
        </el-form-item>
        <el-form-item v-if="userSelectType==='userRemove'" :label="name+'ID'" prop="">
          <span>{{ userQuery[idkey] }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userSelectCancel">取消</el-button>
        <el-button type="primary" @click="userSelectSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, editmenu, disable, user, userRemove } from '@/api/system/role'

export default {
  name: 'SystemRole',
  components: { Pagination },
  data() {
    return {
      name: '角色',
      height: 680,
      loading: false,
      idkey: 'role_id',
      exps: [],
      query: { page: 1, limit: 12, search_field: 'role_name', search_exp: 'like', date_field: 'create_time' },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      dialogLoad: false,
      model: {
        role_id: '',
        menu_ids: [],
        role_name: '',
        role_desc: '',
        sort: 250
      },
      rules: {
        role_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      menuIdkey: 'menu_id',
      menuData: [],
      menuIds: [],
      menuProps: { children: 'children', label: 'menu_name' },
      menuCheckAll: false,
      menuExpandAll: false,
      menuCheckAllPid: {},
      selMenuRefs: 'menuRef',
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      is_disable: 0,
      menu_ids: [],
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
      userSelectType: ''
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
        this.menuData = res.data.menu
        this.menuIds = res.data.menu_ids
        this.exps = res.data.exps
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
      this.menuCheckAll = false
      this.menuExpandAll = false
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.$refs['table'].clearSort()
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
        if (selectType === 'removeu') {
          this.selectTitle = this.name + '解除用户'
        } else if (selectType === 'editmenu') {
          this.selectTitle = this.name + '修改菜单'
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
        if (selectType === 'removeu') {
          this.removeu(this.selection)
        } else if (selectType === 'editmenu') {
          this.editmenu(this.selection)
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
          role_id: this.selectGetIds(row),
          user_ids: []
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修改菜单
    editmenu(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editmenu({
          ids: this.selectGetIds(row),
          menu_ids: this.menu_ids
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
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
    // 菜单选择
    menuCheck(refs = 'menuRef') {
      this.selMenuRefs = refs
      this.menuCheckSetKeys()
    },
    menuCheckAllChange(refs = 'menuRef') {
      this.selMenuRefs = refs
      if (this.menuCheckAll) {
        this.menuIds.forEach((item) => {
          this.$refs[this.selMenuRefs].setChecked(item, true, true)
        })
      } else {
        this.$refs[this.selMenuRefs].setCheckedKeys([])
      }
      this.menuCheckSetKeys()
    },
    menuExpandAllChange(refs = 'menuRef') {
      this.selMenuRefs = refs
      const expanded = this.menuExpandAll
      const length = this.$refs[this.selMenuRefs].store._getAllNodes().length
      for (let i = 0; i < length; i++) {
        this.$refs[this.selMenuRefs].store._getAllNodes()[i].expanded = expanded
      }
    },
    menuCheckAllChangePid(node, data, refs = 'menuRef') {
      this.selMenuRefs = refs
      this.menuCheckAllPid[data.menu_id] = node.checked
      this.$refs[this.selMenuRefs].setChecked(data.menu_id, !this.menuCheckAllPid[data.menu_id], true)
      data.children.forEach((item) => {
        this.$refs[this.selMenuRefs].setChecked(item.menu_id, !this.menuCheckAllPid[data.menu_id], true)
      })
      this.menuCheckSetKeys()
    },
    menuCheckSetKeys() {
      if (this.selMenuRefs === 'menuRef') {
        this.model.menu_ids = this.$refs[this.selMenuRefs].getCheckedKeys()
      } else {
        this.menu_ids = this.$refs[this.selMenuRefs].getCheckedKeys()
      }
    },
    // 用户显示
    userShow(row) {
      this.userDialog = true
      this.userDialogTitle = this.name + this.userName + '：' + row.role_name
      this.userQuery.role_id = row.role_id
      this.userList()
    },
    // 用户列表
    userList() {
      this.userLoad = true
      user(this.userQuery).then(res => {
        this.userData = res.data.list
        this.userCount = res.data.count
        this.userLoad = false
      }).catch(() => {
        this.userLoad = false
      })
    },
    // 用户排序
    userSort(sort) {
      this.userQuery.sort_field = sort.prop
      this.userQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.userQuery.sort_value = 'asc'
        this.userList()
      }
      if (sort.order === 'descending') {
        this.userQuery.sort_value = 'desc'
        this.userList()
      }
    },
    // 用户选中操作
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
          this.userSelectTitle = this.name + '解除用户'
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
    // 用户解除
    userRemove(row) {
      if (!row.length) {
        this.userSelectAlert()
      } else {
        this.userLoad = true
        userRemove({
          role_id: this.userQuery.role_id,
          user_ids: this.userSelectGetIds(row)
        }).then(res => {
          this.userList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.userLoad = false
        })
      }
    }
  }
}
</script>
