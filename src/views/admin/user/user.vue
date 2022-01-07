<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="username" label="账号" />
            <el-option value="nickname" label="昵称" />
            <el-option value="phone" label="手机" />
            <el-option value="email" label="邮箱" />
            <el-option :value="idkey" label="ID" />
            <el-option value="is_super" label="是否超管" />
            <el-option value="is_disable" label="是否禁用" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
            <el-option value="login_time" label="登录时间" />
            <el-option value="logout_time" label="退出时间" />
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
          <el-button @click="selectOpen('super')">超管</el-button>
          <el-button @click="selectOpen('disable')">禁用</el-button>
          <el-button @click="selectOpen('password')">密码</el-button>
          <el-button @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :rows="2" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='super'" label="是否超管" prop="">
            <el-switch v-model="is_super" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='password'" label="新密码" prop="password">
            <el-input v-model="password" placeholder="请输入新密码" clearable show-password />
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
    <el-table ref="table" v-loading="loading" :data="datas" :height="height" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" min-width="100" sortable="custom" />
      <el-table-column prop="username" label="账号" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="nickname" label="昵称" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="email" label="邮箱" min-width="250" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="is_super" label="超管" min-width="75" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_super" :active-value="1" :inactive-value="0" @change="isSuper([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="75" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="isDisable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="75" sortable="custom" />
      <el-table-column prop="login_num" label="登录次数" min-width="105" sortable="custom" />
      <el-table-column prop="login_time" label="登录时间" min-width="160" sortable="custom" />
      <el-table-column prop="create_tie" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="160" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="rule(row)">权限</el-button>
          <el-button size="mini" type="text" @click="selectOpen('password', row)">密码</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele', row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :model="model" :rules="rules" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="头像" prop="avatar_url">
          <el-col :span="10">
            <el-avatar v-if="model.avatar_url" shape="circle" fit="contain" :size="100" :src="model.avatar_url" />
            <el-avatar v-else icon="el-icon-user-solid" :size="100" />
          </el-col>
          <el-col :span="14">
            <el-button size="mini" @click="fileUpload()">上传头像</el-button>
            <el-button size="mini" @click="fileDelete('avatar')">删除</el-button>
            <p>jpg、png图片，小于100kb，宽高1:1</p>
          </el-col>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input key="username" v-model="model.username" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="model.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="model[idkey] == ''" label="密码" prop="password">
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
        <el-form-item v-if="model.login_time" label="登录时间" prop="login_time">
          <el-input v-model="model.login_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.logout_time" label="退出时间" prop="logout_time">
          <el-input v-model="model.logout_time" disabled />
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
    <!-- 分配权限 -->
    <el-dialog :title="name+'分配权限：'+model[idkey]" :visible.sync="ruleDialog" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="roleRef" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="账号">
          <el-input v-model="model.username" disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="model.nickname" disabled />
        </el-form-item>
        <el-form-item label="按角色">
          <el-checkbox-group v-model="model.admin_role_ids">
            <el-checkbox v-for="item in roleData" :key="item.admin_role_id" :label="item.admin_role_id">{{ item.role_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按菜单">
          <el-tree
            ref="menuRef"
            :key="menuKey"
            :data="menuTree"
            :props="menuProps"
            :default-checked-keys="model.admin_menu_ids"
            :expand-on-click-node="false"
            node-key="admin_menu_id"
            default-expand-all
            show-checkbox
            check-strictly
            highlight-current
            @check="ruleMenuCheck"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}<i v-if="data.is_check" class="el-icon-check" title="已分配" /></span>
              <span>
                <i v-if="data.is_role" class="el-icon-s-custom" style="margin-left:10px" title="按角色" />
                <i v-if="data.is_menu" class="el-icon-menu" style="margin-left:10px" title="按菜单" />
                <i v-if="data.menu_url" class="el-icon-link" style="margin-left:10px" :title="data.menu_url" />
                <i v-else class="el-icon-link" style="margin-left:10px;color:#fff" />
                <i v-if="data.is_unauth" class="el-icon-unlock" style="margin-left:10px;" title="无需权限" />
                <i v-else class="el-icon-unlock" style="margin-left:10px;color:#fff" />
                <i v-if="data.is_unlogin" class="el-icon-user" style="margin-left:10px;" title="无需登录" />
                <i v-else class="el-icon-user" style="margin-left:10px;color:#fff" />
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleCancel">取消</el-button>
        <el-button type="primary" @click="ruleSubmit">提交</el-button>
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
import { list, info, add, edit, dele, rule, pwd, issuper, disable } from '@/api/admin/user'

export default {
  name: 'AdminUser',
  components: { Pagination, FileManage },
  data() {
    return {
      name: '用户',
      height: 680,
      loading: false,
      idkey: 'admin_user_id',
      datas: [],
      count: 0,
      query: {
        page: 1,
        limit: 15,
        search_field: 'username',
        date_field: 'create_time'
      },
      dialog: false,
      dialogTitle: '',
      model: {
        admin_user_id: '',
        avatar_id: 0,
        avatar_url: '',
        admin_role_ids: [],
        admin_menu_ids: [],
        menu_ids: [],
        username: '',
        nickname: '',
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
        update_time: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      is_super: 0,
      is_disable: 0,
      password: '',
      ruleDialog: false,
      roleData: [],
      menuKey: 1,
      menuTree: [],
      menuProps: { children: 'children', label: 'menu_name' },
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
        this.datas = res.data.list
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
      this.$refs['table'].clearSelection()
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.admin_user_id) {
            edit(this.model, 'post').then(res => {
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
      ++this.menuKey
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
        if (selectType === 'super') {
          this.selectTitle = '是否超管'
        } else if (selectType === 'disable') {
          this.selectTitle = '是否禁用'
        } else if (selectType === 'password') {
          this.selectTitle = '重置密码'
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
        if (selectType === 'super') {
          this.isSuper(this.selection, true)
        } else if (selectType === 'disable') {
          this.isDisable(this.selection, true)
        } else if (selectType === 'password') {
          this.rePassword(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 是否超管
    isSuper(row, select = false) {
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
    isDisable(row, select = false) {
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
    // 重置密码
    rePassword(row, select = false) {
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
        pwd({
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
    // 分配权限
    rule(row) {
      this.ruleDialog = true
      var id = {}
      id[this.idkey] = row[this.idkey]
      rule(id).then(res => {
        this.model[this.idkey] = row[this.idkey]
        this.roleData = res.data.admin_role
        this.menuTree = res.data.admin_menu
        this.model.username = res.data.username
        this.model.nickname = res.data.nickname
        this.model.admin_role_ids = res.data.admin_role_ids
        this.model.admin_menu_ids = res.data.admin_menu_ids
        this.model.menu_ids = res.data.menu_ids
      })
      this.$refs['table'].clearSelection()
    },
    ruleCancel() {
      this.ruleDialog = false
      this.reset()
    },
    ruleMenuCheck(data, node) {
      this.model.admin_menu_ids = node.checkedKeys
    },
    ruleSubmit() {
      this.$refs['roleRef'].validate(valid => {
        if (valid) {
          this.loading = true
          rule({
            admin_user_id: this.model.admin_user_id,
            admin_role_ids: this.model.admin_role_ids,
            admin_menu_ids: this.model.admin_menu_ids
          }, 'post').then(res => {
            this.list()
            this.ruleDialog = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
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
    fileDelete(field = '') {
      if (field === 'avatar') {
        this.model.avatar_id = 0
        this.model.avatar_url = ''
      }
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
