<template>
  <div class="app-container">
    <!-- 添加操作 -->
    <div class="filter-container">
      <!-- 刷新 -->
      <el-row>
        <el-col>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-checkbox v-model="isExpandAll" border @change="expandAll">收起</el-checkbox>
          <el-button class="ya-margin-left" @click="selectOpen('pid')">父级</el-button>
          <el-button @click="selectOpen('unlogin')">登录</el-button>
          <el-button @click="selectOpen('unauth')">权限</el-button>
          <el-button @click="selectOpen('disable')">禁用</el-button>
          <el-button @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
        <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
          <el-form ref="selectRef" label-width="120px">
            <el-form-item :label="name+'ID'" prop="">
              <el-input v-model="selectIds" type="textarea" :rows="2" disabled />
            </el-form-item>
            <el-form-item v-if="selectType==='pid'" label="父级" prop="">
              <el-cascader
                v-model="menu_pid"
                :options="data"
                :props="props"
                style="width:100%"
                clearable
                filterable
                @change="selectPidChange"
              />
            </el-form-item>
            <el-form-item v-else-if="selectType==='unlogin'" label="无需登录" prop="">
              <el-switch v-model="is_unlogin" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item v-else-if="selectType==='unauth'" label="无需权限" prop="">
              <el-switch v-model="is_unauth" :active-value="1" :inactive-value="0" />
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
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" :row-key="idkey" @selection-change="select" @cell-dblclick="tableCellDbclick">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="menu_name" label="菜单名称" min-width="220" />
      <el-table-column prop="menu_url" label="菜单链接(roles)" min-width="300">
        <template slot="header">
          <span>菜单链接(roles)</span>
          <el-tooltip placement="top">
            <div slot="content">双击单元格复制</div>
            <i class="el-icon-warning" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="is_unlogin" label="无需登录" min-width="95" align="center">
        <template slot="header">
          <span>无需登录</span>
          <el-tooltip placement="top">
            <div slot="content">开启后不用登录就可以访问，如登录</div>
            <i class="el-icon-warning" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_unlogin" :active-value="1" :inactive-value="0" @change="unlogin([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unauth" label="无需权限" min-width="95" align="center">
        <template slot="header">
          <span>无需权限</span>
          <el-tooltip placement="top">
            <div slot="content">开启后不用分配权限也可以访问</div>
            <i class="el-icon-warning" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_unauth" :active-value="1" :inactive-value="0" @change="unauth([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="85" align="center">
        <template slot="header">
          <span>禁用</span>
          <el-tooltip placement="top">
            <div slot="content">开启后无法访问</div>
            <i class="el-icon-warning" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column :prop="idkey" label="ID" min-width="65" />
      <el-table-column prop="menu_sort" label="排序" min-width="60" />
      <el-table-column label="操作" min-width="195" align="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="roleShow(row)">角色</el-button>
          <el-button size="mini" type="text" @click="userShow(row,idkey)">用户</el-button>
          <el-button size="mini" type="text" title="添加下级" @click="add(row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="菜单父级" prop="menu_pid">
          <el-cascader v-model="model.menu_pid" :options="data" :props="props" style="width:100%" placeholder="一级菜单" clearable filterable @change="pidChange" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="model.menu_name" clearable placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单链接" prop="menu_url">
          <el-input v-model="model.menu_url" clearable placeholder="应用/控制器/操作，区分大小写">
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.menu_url, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="菜单排序" prop="menu_sort">
          <el-input v-model="model.menu_sort" type="number" placeholder="250" />
        </el-form-item>
        <el-form-item label="快速添加" prop="">
          <el-checkbox v-model="model.add_list">列表</el-checkbox>
          <el-checkbox v-model="model.add_info">信息</el-checkbox>
          <el-checkbox v-model="model.add_add">添加</el-checkbox>
          <el-checkbox v-model="model.add_edit">修改</el-checkbox>
          <el-checkbox v-model="model.add_dele">删除</el-checkbox>
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="快速修改" prop="">
          <el-checkbox v-model="model.edit_list">列表</el-checkbox>
          <el-checkbox v-model="model.edit_info">信息</el-checkbox>
          <el-checkbox v-model="model.edit_add">添加</el-checkbox>
          <el-checkbox v-model="model.edit_edit">修改</el-checkbox>
          <el-checkbox v-model="model.edit_dele">删除</el-checkbox>
        </el-form-item>
        <el-form-item label="" prop="">
          <span>快速添加<span v-if="model[idkey]">、修改</span>，需要输入菜单链接：应用/控制器，不含操作</span>
        </el-form-item>
        <el-form-item v-if="model.create_time" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.update_time" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 角色 -->
    <el-dialog :title="roleDialogTitle" :visible.sync="roleDialog" width="65%" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table ref="roleRef" v-loading="roleLoad" :data="roleData" :height="height" @sort-change="roleSort">
        <el-table-column prop="admin_role_id" label="角色ID" min-width="100" sortable="custom" />
        <el-table-column prop="role_name" label="角色" min-width="120" sortable="custom" />
        <el-table-column prop="role_desc" label="描述" min-width="130" />
        <el-table-column prop="is_disable" label="禁用" min-width="80" align="center" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="85" align="right" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="text" @click="userShow(row)">用户</el-button>
            <el-button size="mini" type="text" @click="roleRemove(row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="roleCount > 0" :total="roleCount" :page.sync="roleQuery.page" :limit.sync="roleQuery.limit" @pagination="roleList" />
    </el-dialog>
    <!-- 用户 -->
    <el-dialog :title="userDialogTitle" :visible.sync="userDialog" width="65%" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table ref="userRef" v-loading="userLoad" :data="userData" :height="height" @sort-change="userSort">
        <el-table-column prop="admin_user_id" label="用户ID" min-width="100" sortable="custom" />
        <el-table-column prop="username" label="账号" min-width="120" sortable="custom" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="remark" label="备注" min-width="100" />
        <el-table-column prop="is_super" label="超管" min-width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_super" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_disable" label="禁用" min-width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" align="right" fixed="right">
          <template slot-scope="{ row }">
            <el-button v-if="userQuery[idkey]" size="mini" type="text" @click="userRemove(row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="userList" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, pid, disable, unauth, unlogin, role, roleRemove, user, userRemove } from '@/api/admin/menu'

export default {
  name: 'AdminMenu',
  components: { Pagination },
  directives: { },
  data() {
    return {
      name: '菜单',
      height: 680,
      loading: false,
      idkey: 'admin_menu_id',
      data: [],
      props: { checkStrictly: true, value: 'admin_menu_id', label: 'menu_name' },
      dialog: false,
      dialogTitle: '',
      model: {
        admin_menu_id: '',
        menu_pid: 0,
        menu_name: '',
        menu_url: '',
        menu_sort: 250,
        add_list: false,
        add_info: false,
        add_add: false,
        add_edit: false,
        add_dele: false,
        edit_list: false,
        edit_info: false,
        edit_add: false,
        edit_edit: false,
        edit_dele: false
      },
      rules: {
        menu_name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
      },
      isExpandAll: true,
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      menu_pid: 0,
      is_unlogin: 0,
      is_unauth: 0,
      is_disable: 0,
      roleDialog: false,
      roleDialogTitle: '',
      roleLoad: false,
      roleData: [],
      roleCount: 0,
      roleQuery: { page: 1, limit: 10 },
      userDialog: false,
      userDialogTitle: '',
      userLoad: false,
      userData: [],
      userCount: 0,
      userQuery: { page: 1, limit: 10 }
    }
  },
  created() {
    this.height = screenHeight(210)
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list().then(res => {
        this.data = res.data.list
        this.isExpandAll = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加修改
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.model = this.$options.data().model
      if (row) {
        this.model.menu_pid = row[this.idkey]
      }
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.reset(res.data)
      }).catch(() => {
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
      }
    },
    // 刷新
    refresh() {
      this.list()
    },
    // 收起
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
        if (selectType === 'pid') {
          this.selectTitle = '设置父级'
        } else if (selectType === 'unlogin') {
          this.selectTitle = '无需登录'
        } else if (selectType === 'unauth') {
          this.selectTitle = '无需权限'
        } else if (selectType === 'disable') {
          this.selectTitle = '是否禁用'
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
        if (selectType === 'pid') {
          this.setpid(this.selection)
        } else if (selectType === 'unlogin') {
          this.unlogin(this.selection, true)
        } else if (selectType === 'unauth') {
          this.unauth(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
        this.selectType = selectType
      }
    },
    selectPidChange(value) {
      if (value) {
        this.menu_pid = value[value.length - 1]
      }
    },
    // 设置父级
    setpid(row) {
      pid({
        ids: this.selectGetIds(row),
        menu_pid: this.menu_pid
      }).then(res => {
        this.list()
        this.selectDialog = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
      })
    },
    // 无需登录
    unlogin(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_unlogin = row[0].is_unlogin
        if (select) {
          is_unlogin = this.is_unlogin
        }
        unlogin({
          ids: this.selectGetIds(row),
          is_unlogin: is_unlogin
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 无需权限
    unauth(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_unauth = row[0].is_unauth
        if (select) {
          is_unauth = this.is_unauth
        }
        unauth({
          ids: this.selectGetIds(row),
          is_unauth: is_unauth
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
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
          this.loading = false
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
    },
    // 父级选择
    pidChange(value) {
      if (value) {
        this.model.menu_pid = value[value.length - 1]
      }
    },
    // 角色显示
    roleShow(row) {
      this.roleDialog = true
      this.roleDialogTitle = '菜单角色：' + row.menu_name
      this.roleQuery.admin_menu_id = row.admin_menu_id
      this.roleList()
    },
    // 角色列表
    roleList() {
      this.roleLoad = true
      role(this.roleQuery).then(res => {
        this.roleData = res.data.list
        this.roleCount = res.data.count
        this.roleLoad = false
      }).catch(() => {
        this.roleLoad = false
      })
    },
    // 角色排序
    roleSort(sort) {
      this.roleQuery.sort_field = sort.prop
      this.roleQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.roleQuery.sort_value = 'asc'
        this.roleList()
      }
      if (sort.order === 'descending') {
        this.roleQuery.sort_value = 'desc'
        this.roleList()
      }
    },
    // 角色解除
    roleRemove(row) {
      this.$confirm(
        '确定要解除菜单与角色 <span style="color:red">' + row.role_name + ' </span>的关联吗？',
        '解除角色：' + row.admin_role_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.roleLoad = true
        roleRemove({
          admin_menu_id: this.roleQuery.admin_menu_id,
          admin_role_id: row.admin_role_id
        }).then(res => {
          this.roleList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.roleLoad = false
        })
      }).catch(() => {})
    },
    // 用户显示
    userShow(row, type = 'admin_role_id') {
      this.userDialog = true
      if (type === 'admin_menu_id') {
        this.userDialogTitle = '菜单用户（按菜单）：' + row.menu_name
        this.userQuery.admin_menu_id = row.admin_menu_id
        this.userQuery.admin_role_id = ''
      } else {
        this.userDialogTitle = '菜单用户（按角色）：' + row.role_name
        this.userQuery.admin_menu_id = ''
        this.userQuery.admin_role_id = row.admin_role_id
      }
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
    // 用户解除
    userRemove(row) {
      this.$confirm(
        '确定要解除菜单与用户 <span style="color:red">' + row.username + ' </span>的关联吗？',
        '解除用户：' + row.admin_user_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.userLoad = true
        userRemove({
          admin_menu_id: this.userQuery.admin_menu_id,
          admin_user_id: row.admin_user_id
        }).then(res => {
          this.userList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.userLoad = false
        })
      }).catch(() => {})
    },
    // 复制
    copy(text, event) {
      clip(text, event)
    },
    // 表格单元格双击
    tableCellDbclick(row, column, cell, event) {
      this.copy(row[column.property], event)
    }
  }
}
</script>
