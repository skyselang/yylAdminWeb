<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option :value="idkey" label="ID" />
            <el-option value="nickname" label="昵称" />
            <el-option value="username" label="账号" />
            <el-option value="phone" label="手机" />
            <el-option value="email" label="邮箱" />
            <el-option value="dept_ids" label="部门" />
            <el-option value="post_ids" label="职位" />
            <el-option value="role_ids" label="角色" />
            <el-option value="is_super" label="超管" />
            <el-option value="is_disable" label="禁用" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-select v-if="query.search_field==='is_super'||query.search_field==='is_disable'" v-model="query.search_value" class="filter-item ya-search-value">
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-cascader v-else-if="query.search_field==='dept_ids'" v-model="query.search_value" :options="deptData" :props="deptProps" class="filter-item ya-search-value" clearable filterable collapse-tags />
          <el-cascader v-else-if="query.search_field==='post_ids'" v-model="query.search_value" :options="postData" :props="postProps" class="filter-item ya-search-value" clearable filterable collapse-tags />
          <el-select v-else-if="query.search_field==='role_ids'" v-model="query.search_value" class="filter-item ya-search-value" clearable filterable multiple collapse-tags>
            <el-option v-for="item in roleData" :key="item.role_id" :label="item.role_name" :value="item.role_id" />
          </el-select>
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="查询内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
            <el-option value="login_time" label="登录时间" />
            <el-option value="logout_time" label="退出时间" />
          </el-select>
          <el-date-picker v-model="query.date_value" type="daterange" class="filter-item ya-date-value" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
          <el-button class="filter-item" type="primary" title="查询/刷新" @click="search()">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" title="重置" @click="refresh()" />
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button title="修改部门" @click="selectOpen('editdept')">部门</el-button>
          <el-button title="修改职位" @click="selectOpen('editpost')">职位</el-button>
          <el-button title="修改角色" @click="selectOpen('editrole')">角色</el-button>
          <el-button title="重置密码" @click="selectOpen('password')">密码</el-button>
          <el-button title="是否超管" @click="selectOpen('super')">超管</el-button>
          <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button :title="'删除'+name" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" :prop="idkey">
            <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 5, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='editdept'" label="部门" prop="dept_ids">
            <el-cascader v-model="dept_ids" :options="deptData" :props="deptProps" class="ya-width-100p" clearable filterable />
          </el-form-item>
          <el-form-item v-else-if="selectType==='editpost'" label="职位" prop="post_ids">
            <el-cascader v-model="post_ids" :options="postData" :props="postProps" class="ya-width-100p" clearable filterable />
          </el-form-item>
          <el-form-item v-else-if="selectType==='editrole'" label="角色" prop="role_ids">
            <el-select v-model="role_ids" class="ya-width-100p" clearable filterable multiple>
              <el-option v-for="item in roleData" :key="item.role_id" :label="item.role_name" :value="item.role_id" />
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="selectType==='password'" label="新密码" prop="password">
            <el-input v-model="password" placeholder="请输入新密码" clearable show-password />
          </el-form-item>
          <el-form-item v-else-if="selectType==='super'" label="是否超管" prop="">
            <el-switch v-model="is_super" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='disable'" label="是否禁用" prop="">
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
    <el-table ref="table" v-loading="loading" :data="data" :height="height" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" width="60" sortable="custom" />
      <el-table-column prop="nickname" label="昵称" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="username" label="账号" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="dept_names" label="部门" min-width="180" show-overflow-tooltip />
      <el-table-column prop="post_names" label="职位" min-width="180" show-overflow-tooltip />
      <el-table-column prop="role_names" label="角色" min-width="180" show-overflow-tooltip />
      <el-table-column prop="is_super" label="超管" min-width="75" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_super" :active-value="1" :inactive-value="0" @change="issuper([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="75" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="75" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button size="mini" type="text" title="信息/修改" @click="edit(scope.row)">修改</el-button>
          <el-button size="mini" type="text" title="删除" @click="selectOpen('dele', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count>0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="头像" prop="avatar_url">
          <el-col :span="12">
            <el-avatar v-if="model.avatar_url" shape="circle" fit="contain" :size="100" :src="model.avatar_url" />
            <el-avatar v-else icon="el-icon-user-solid" :size="100" />
          </el-col>
          <el-col :span="12">
            <el-button size="mini" @click="fileUpload()">上传头像</el-button>
            <el-button size="mini" @click="fileDelete('avatar')">删除</el-button>
            <p>图片小于 200 KB，jpg、png格式。</p>
          </el-col>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="model.nickname" placeholder="请输入昵称（姓名）" clearable />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input key="username" v-model="model.username" placeholder="请输入账号（用户名）" clearable />
        </el-form-item>
        <el-form-item v-if="model[idkey]==''" label="密码" prop="password">
          <el-input key="password" v-model="model.password" placeholder="请输入密码" clearable show-password />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="model.phone" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="model.email" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="登录IP" prop="login_ip">
          <el-input v-model="model.login_ip" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="登录地区" prop="login_region">
          <el-input v-model="model.login_region" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="登录时间" prop="login_time">
          <el-input v-model="model.login_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="退出时间" prop="logout_time">
          <el-input v-model="model.logout_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
          <el-input v-model="model.delete_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="部门" prop="dept_ids">
          <el-cascader v-model="model.dept_ids" :options="deptData" :props="deptProps" class="ya-width-100p" disabled placeholder="" />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="职位" prop="post_ids">
          <el-cascader v-model="model.post_ids" :options="postData" :props="postProps" class="ya-width-100p" disabled placeholder="" />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="角色" prop="role_ids">
          <el-select v-model="model.role_ids" class="ya-width-100p" disabled multiple placeholder="">
            <el-option v-for="item in roleData" :key="item.role_id" :label="item.role_name" :value="item.role_id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="菜单(权限)" prop="menu_tree">
          <span>
            <el-checkbox v-model="menuExpandAll" title="展开/收起" @change="menuExpandAllChange">展开</el-checkbox>
          </span>
          <el-tree ref="menuRef" :data="model.menu_tree" :props="menuProps" node-key="menu_id" :default-checked-keys="model.menu_ids" :expand-on-click-node="false" highlight-current>
            <span slot-scope="scope" class="custom-tree-node">
              <span>{{ scope.node.label }}<i v-if="scope.data.is_check" class="el-icon-check" style="color:#1890ff" title="已分配" /></span>
              <span>
                <i v-if="scope.data.is_role" class="el-icon-s-custom" style="margin-left:10px" title="角色" />
                <i v-if="scope.data.menu_url" class="el-icon-link" style="margin-left:10px" :title="scope.data.menu_url" />
                <i v-else class="el-icon-link" style="margin-left:10px;color:#fff" />
                <i v-if="scope.data.is_unlogin" class="el-icon-user" style="margin-left:10px;" title="免登" />
                <i v-else class="el-icon-user" style="margin-left:10px;color:#fff" />
                <i v-if="scope.data.is_unauth" class="el-icon-unlock" style="margin-left:10px;" title="免权" />
                <i v-else class="el-icon-unlock" style="margin-left:10px;color:#fff" />
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 上传头像 -->
    <el-dialog title="上传头像" :visible.sync="fileDialog" top="1vh" width="80%" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import FileManage from '@/components/FileManage'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, editdept, editpost, editrole, repwd, issuper, disable } from '@/api/system/user'

export default {
  name: 'SystemUser',
  components: { Pagination, FileManage },
  data() {
    return {
      name: '用户',
      height: 680,
      loading: false,
      idkey: 'user_id',
      exps: [],
      query: { page: 1, limit: 12, search_field: 'username', search_exp: 'like', date_field: 'create_time' },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        user_id: '',
        avatar_id: 0,
        avatar_url: '',
        nickname: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        remark: '',
        sort: 250,
        login_ip: '',
        login_region: '',
        login_time: '',
        logout_time: '',
        create_time: '',
        update_time: '',
        dept_ids: [],
        post_ids: [],
        role_ids: []
      },
      rules: {
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      dept_ids: [],
      post_ids: [],
      role_ids: [],
      password: '',
      is_super: 0,
      is_disable: 0,
      deptData: [],
      deptProps: { checkStrictly: true, value: 'dept_id', label: 'dept_name', multiple: true, emitPath: false },
      postData: [],
      postProps: { checkStrictly: true, value: 'post_id', label: 'post_name', multiple: true, emitPath: false },
      roleData: [],
      menuProps: { label: 'menu_name', children: 'children' },
      menuExpandAll: false,
      fileDialog: false
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
        this.deptData = res.data.dept
        this.postData = res.data.post
        this.roleData = res.data.role
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
      this.menuExpandAll = false
      this.fileDialog = false
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
        if (selectType === 'editdept') {
          this.selectTitle = this.name + '修改部门'
        } else if (selectType === 'editpost') {
          this.selectTitle = this.name + '修改职位'
        } else if (selectType === 'editrole') {
          this.selectTitle = this.name + '修改角色'
        } else if (selectType === 'super') {
          this.selectTitle = this.name + '是否超管'
        } else if (selectType === 'password') {
          this.selectTitle = this.name + '重置密码'
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
        if (selectType === 'editdept') {
          this.editdept(this.selection, true)
        } else if (selectType === 'editpost') {
          this.editpost(this.selection, true)
        } else if (selectType === 'editrole') {
          this.editrole(this.selection, true)
        } else if (selectType === 'super') {
          this.issuper(this.selection, true)
        } else if (selectType === 'password') {
          this.repwd(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 重置密码
    repwd(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        if (!this.password) {
          this.$message.error('请输入新密码')
          return false
        }
        this.loading = true
        var password = row[0].password
        if (select) {
          password = this.password
        }
        repwd({
          ids: this.selectGetIds(row),
          password: password
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修改部门
    editdept(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editdept({
          ids: this.selectGetIds(row),
          dept_ids: this.dept_ids
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修改职位
    editpost(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editpost({
          ids: this.selectGetIds(row),
          post_ids: this.post_ids
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修改角色
    editrole(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editrole({
          ids: this.selectGetIds(row),
          role_ids: this.role_ids
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 是否超管
    issuper(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_super = row[0].is_super
        if (select) {
          is_super = this.is_super
        }
        issuper({
          ids: this.selectGetIds(row),
          is_super: is_super
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
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
    // 菜单（权限）
    menuExpandAllChange() {
      const expanded = this.menuExpandAll
      const length = this.$refs.menuRef.store._getAllNodes().length
      for (let i = 0; i < length; i++) {
        this.$refs.menuRef.store._getAllNodes()[i].expanded = expanded
      }
    },
    // 上传头像
    fileUpload() {
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(filelist) {
      this.fileDialog = false
      this.model.avatar_id = filelist[0]['file_id']
      this.model.avatar_url = filelist[0]['file_url']
    },
    fileDelete() {
      this.model.avatar_id = 0
      this.model.avatar_url = ''
    }
  }
}
</script>
