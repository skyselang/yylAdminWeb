<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="22">
          <el-input v-model="query.username" class="filter-item" style="width: 150px;" placeholder="账号" clearable />
          <el-input v-model="query.nickname" class="filter-item" style="width: 150px;" placeholder="昵称" clearable />
          <el-input v-model="query.email" class="filter-item" style="width: 250px;" placeholder="邮箱" clearable />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="2" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="datas" :height="height" style="width: 100%" border @sort-change="sort">
      <el-table-column prop="admin_user_id" label="用户ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="username" label="账号" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="nickname" label="昵称" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="email" label="邮箱" min-width="250" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="create_tie" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="login_time" label="登录时间" min-width="160" sortable="custom" />
      <el-table-column prop="login_num" label="登录次数" min-width="105" sortable="custom" />
      <el-table-column prop="sort" label="排序" width="75" sortable="custom" />
      <el-table-column prop="is_super" label="超管" min-width="75" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_super" :active-value="1" :inactive-value="0" @change="isSuper(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="75" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="isProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="280" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="rule(row)">权限</el-button>
          <el-button size="mini" type="primary" @click="pwd(row)">密码</el-button>
          <el-button size="mini" type="success" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="dele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" width="50%" :before-close="cancel">
      <el-form ref="ref" :model="model" :rules="rules" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item v-if="model.admin_user_id && model.avatar" label="头像" prop="avatar">
          <el-col :span="10">
            <el-avatar shape="circle" fit="contain" :size="100" :src="model.avatar" />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center" />
          <el-col :span="10">
            <el-upload
              name="avatar_file"
              :show-file-list="false"
              :before-upload="uploadBefore"
              :action="uploadAction"
              :headers="uploadHeaders"
              :data="uploadData"
              :on-success="uploadSuccess"
              :on-error="uploadError"
            >
              <el-button>更换头像</el-button>
            </el-upload>
            <span>jpg、png图片，小于100kb，宽高1:1</span>
          </el-col>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input key="username" v-model="model.username" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="model.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="model.admin_user_id == ''" label="密码" prop="password">
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
        <el-form-item v-if="model.admin_user_id" label="登录IP" prop="login_ip">
          <el-col :span="10">
            <el-input v-model="model.login_ip" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">登录地区</el-col>
          <el-col :span="10">
            <el-input v-model="model.login_region" disabled />
          </el-col>
        </el-form-item>
        <el-form-item v-if="model.admin_user_id" label="登录时间" prop="login_time">
          <el-col :span="10">
            <el-input v-model="model.login_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">退出时间</el-col>
          <el-col :span="10">
            <el-input v-model="model.logout_time" disabled />
          </el-col>
        </el-form-item>
        <el-form-item v-if="model.admin_user_id" label="添加时间" prop="create_time">
          <el-col :span="10">
            <el-input v-model="model.create_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">修改时间</el-col>
          <el-col :span="10">
            <el-input v-model="model.update_time" disabled />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog :title="'用户分配权限：'+model.admin_user_id" :visible.sync="ruleDialog" top="1vh" width="50%">
      <el-form ref="roleRef" :model="model" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item label="账号">
          <el-col :span="10">
            <el-input v-model="model.username" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">昵称</el-col>
          <el-col :span="10">
            <el-input v-model="model.nickname" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="按角色">
          <el-checkbox-group v-model="model.admin_role_ids">
            <el-checkbox v-for="item in roleData" :key="item.admin_role_id" :label="item.admin_role_id">{{ item.role_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按菜单">
          <el-tree
            ref="menuRef"
            :data="menuTree"
            :default-checked-keys="model.admin_menu_ids"
            :props="menuProps"
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
    <!-- 重置密码 -->
    <el-dialog :title="'用户重置密码：'+model.admin_user_id" :visible.sync="pwdDialog" top="1vh" width="50%">
      <el-form ref="pwdRef" :rules="pwdRules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item label="账号">
          <el-input v-model="model.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="model.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="model.password" placeholder="请输入新密码" clearable show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdCancel">取消</el-button>
        <el-button type="primary" @click="pwdSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { getAdminUserId, getAdminToken } from '@/utils/auth'
import { list, info, add, edit, dele, issuper, disable, rule, pwd } from '@/api/admin-user'

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      datas: [],
      count: 0,
      query: {
        page: 1,
        limit: 13
      },
      dialog: false,
      dialogTitle: '',
      model: {
        admin_user_id: '',
        admin_role_ids: [],
        admin_menu_ids: [],
        menu_ids: [],
        username: '',
        nickname: '',
        password: '',
        phone: '',
        email: '',
        remark: '',
        sort: 200,
        login_ip: '',
        login_region: '',
        login_time: '',
        logout_time: '',
        create_time: '',
        update_time: ''
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/AdminUser/avatar',
      uploadHeaders: { AdminUserId: getAdminUserId(), AdminToken: getAdminToken() },
      uploadData: { admin_user_id: '' },
      ruleDialog: false,
      roleData: [],
      menuTree: [],
      menuProps: {
        children: 'children',
        label: 'menu_name'
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      pwdDialog: false,
      pwdRules: {
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      }
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
    // 添加
    add() {
      this.dialog = true
      this.dialogTitle = '用户添加'
      this.reset()
    },
    // 修改
    edit(row) {
      this.dialog = true
      this.dialogTitle = '用户修改：' + row.admin_user_id
      this.reset()
      info({
        admin_user_id: row.admin_user_id
      }).then(res => {
        this.model = res.data
      })
    },
    // 删除
    dele(row) {
      this.$confirm(
        '确定要删除用户 <span style="color:red">' + row.username + ' </span>吗？',
        '删除用户：' + row.admin_user_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.loading = true
        dele({
          admin_user_id: row.admin_user_id
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
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
    // 更换头像
    uploadBefore() {
      this.uploadData.admin_user_id = this.model.admin_user_id
    },
    uploadSuccess(res) {
      if (res.code === 200) {
        this.model.avatar = res.data.avatar
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    uploadError() {
      this.$message.error('上传出错！')
    },
    // 是否超管
    isSuper(row) {
      this.loading = true
      issuper({
        admin_user_id: row.admin_user_id,
        is_super: row.is_super
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
      })
    },
    // 是否禁用
    isProhibit(row) {
      this.loading = true
      disable({
        admin_user_id: row.admin_user_id,
        is_disable: row.is_disable
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
      })
    },
    // 分配权限打开
    rule(row) {
      this.ruleDialog = true
      rule({
        admin_user_id: row.admin_user_id
      }).then(res => {
        this.roleData = res.data.admin_role
        this.menuTree = res.data.admin_menu
        this.model.username = res.data.username
        this.model.nickname = res.data.nickname
        this.model.admin_user_id = row.admin_user_id
        this.model.admin_role_ids = res.data.admin_role_ids
        this.model.admin_menu_ids = res.data.admin_menu_ids
        this.model.menu_ids = res.data.menu_ids
      })
    },
    // 分配权限取消
    ruleCancel() {
      this.ruleDialog = false
      this.reset()
    },
    // 分配权限按菜单
    ruleMenuCheck(data, node) {
      this.model.admin_menu_ids = node.checkedKeys
    },
    // 分配权限提交
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
    // 重置密码打开
    pwd(row) {
      this.pwdDialog = true
      this.model.admin_user_id = row.admin_user_id
      this.model.username = row.username
      this.model.nickname = row.nickname
      this.model.password = ''
    },
    // 重置密码取消
    pwdCancel() {
      this.pwdDialog = false
      this.reset()
    },
    // 重置密码提交
    pwdSubmit() {
      this.$refs['pwdRef'].validate(valid => {
        if (valid) {
          this.loading = true
          pwd({
            admin_user_id: this.model.admin_user_id,
            password: this.model.password
          }).then(res => {
            this.list()
            this.pwdDialog = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
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
