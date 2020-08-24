<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input v-model="userQuery.username" class="filter-item" style="width: 200px;" placeholder="账号" clearable />
      <el-input v-model="userQuery.nickname" class="filter-item" style="width: 200px;" placeholder="昵称" clearable />
      <el-button class="filter-item" type="primary" @click="userSearch">
        查询
      </el-button>
      <el-button class="filter-item" type="primary" style="float:right;margin-left:10px" @click="userAddition">
        添加
      </el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="userRefresh">
        刷新
      </el-button>
    </div>
    <!-- 用户 -->
    <el-table v-loading="loading" :data="userData" :height="height" style="width: 100%" border @sort-change="userSort">
      <el-table-column prop="admin_user_id" label="ID" min-width="80" sortable="custom" fixed="left" />
      <el-table-column prop="username" label="账号" min-width="200" sortable="custom" />
      <el-table-column prop="nickname" label="昵称" min-width="110" />
      <el-table-column prop="email" label="邮箱" min-width="100" show-overflow-tooltip />
      <el-table-column prop="sort" label="排序" width="80" sortable="custom" />
      <el-table-column prop="login_num" label="登录次数" min-width="110" sortable="custom" />
      <el-table-column prop="login_ip" label="登录IP" min-width="130" />
      <el-table-column prop="login_time" label="登录时间" min-width="160" sortable="custom" />
      <el-table-column prop="is_super_admin" label="是否超管" min-width="80" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_super_admin" active-value="1" inactive-value="0" @change="userIsSuperAdmin(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_prohibit" label="是否禁用" min-width="80" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_prohibit" active-value="1" inactive-value="0" @change="userIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_prohibit" label="权限" min-width="150" align="center">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userEditRule(row)">
            分配
          </el-button>
          <el-button size="mini" type="primary" @click="userEditRuleInfo(row)">
            明细
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="password" label="密码" width="80" align="center">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userPassword(row)">
            密码
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" align="right" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userModify(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="userDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="userList" />
    <!-- 编辑 -->
    <el-dialog :title="userModel.admin_user_id ? '修改：'+userModel.username : '添加'" :visible.sync="userDialog" width="65%" top="1vh" :before-close="handleClose">
      <el-form ref="userRef" class="dialog-body" :rules="userRules" :model="userModel" label-width="80px" :style="{height:height+50+'px'}">
        <el-form-item v-if="userModel.admin_user_id && userModel.avatar" label="头像">
          <el-avatar shape="circle" fit="contain" :size="100" :src="userModel.avatar" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="userModel.username" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userModel.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id == ''" label="密码" prop="password">
          <el-input v-model="userModel.password" placeholder="请输入密码" clearable show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userModel.email" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userModel.remark" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="userModel.sort" type="number" />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id" label="添加时间" prop="create_time">
          <el-input v-model="userModel.create_time" placeholder="" disabled />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id" label="更新时间" prop="update_time">
          <el-input v-model="userModel.update_time" placeholder="" disabled />
        </el-form-item>
        <el-form-item v-if="userModel.admin_user_id" label="退出时间" prop="logout_time">
          <el-input v-model="userModel.logout_time" placeholder="" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userCancel">
          取消
        </el-button>
        <el-button type="primary" @click="userSubmit">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!-- 权限分配 -->
    <el-dialog :title="'权限分配：'+userModel.username" :visible.sync="userDialogRule" width="65%" top="1vh" :before-close="handleClose">
      <el-form ref="formRuleRef" :model="userModel" label-width="80px" class="dialog-body" :style="{height:height+50+'px'}">
        <el-form-item label="账号">
          <el-input v-model="userModel.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userModel.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="按权限">
          <el-checkbox-group v-model="userModel.admin_rule_ids">
            <el-checkbox v-for="item in formRule" :key="item.admin_rule_id" :label="item.admin_rule_id">{{ item.rule_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按菜单">
          <el-tree
            ref="formMenuRef"
            :data="formMenu"
            :default-checked-keys="userModel.admin_menu_id"
            :props="menuProps"
            :expand-on-click-node="false"
            node-key="admin_menu_id"
            default-expand-all
            show-checkbox
            check-strictly
            highlight-current
            @check="menuCheck"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span v-if="userModel.admin_menu_ids.includes(data.admin_menu_id)">
                <i class="el-icon-check" />
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userCancelRule">
          取消
        </el-button>
        <el-button type="primary" @click="userSubmitRule">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!-- 权限明细 -->
    <el-dialog :title="'权限明细：'+userModel.username" :visible.sync="userDialogRuleInfo" width="65%" top="1vh" :before-close="handleClose">
      <el-form ref="formRuleInfoRef" :model="userModel" label-width="80px" class="dialog-body" :style="{height:height+50+'px'}">
        <el-form-item label="账号">
          <el-input v-model="userModel.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userModel.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="userModel.admin_rule_ids">
            <el-checkbox v-for="item in formRule" :key="item.admin_rule_id" :label="item.admin_rule_id" disabled>{{ item.rule_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree ref="formMenuRef" :data="formMenu" :default-checked-keys="userModel.admin_menu_ids" :props="menuProps" :expand-on-click-node="false" node-key="admin_menu_id" default-expand-all show-checkbox check-strictly highlight-current>
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 密码重置 -->
    <el-dialog :title="'密码重置：'+userModel.username" :visible.sync="userDialogPwd" width="65%" top="1vh" :before-close="handleClose">
      <el-form ref="formPwdRef" :rules="rePwdRules" :model="userModel" label-width="80px" class="dialog-body" :style="{height:height+50+'px'}">
        <el-form-item label="账号">
          <el-input v-model="userModel.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userModel.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="userModel.password" placeholder="请输入新密码" clearable show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userCancelPwd">
          取消
        </el-button>
        <el-button type="primary" @click="userSubmitPwd">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import {
  userList,
  userAdd,
  userEdit,
  userDele,
  userInfo,
  userSuperAdmin,
  userProhibit,
  userRule,
  userRuleInfo,
  userPwd,
  ruleList,
  menuList
} from '@/api/admin'

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      loadingTime: 0,
      userData: [],
      userCount: 0,
      userQuery: {
        page: 1,
        limit: 10
      },
      userDialog: false,
      userDialogRule: false,
      userDialogPwd: false,
      formRule: [],
      userModel: {
        admin_user_id: '',
        admin_rule_ids: [],
        username: '',
        nickname: '',
        password: '',
        email: '',
        remark: '',
        sort: '',
        is_prohibit: '0',
        is_super_admin: '0'
      },
      userRules: {
        username: [{ required: true, message: '必填', trigger: 'blur' }],
        nickname: [{ required: true, message: '必填', trigger: 'blur' }],
        password: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      rePwdRules: {
        password: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      userDialogRuleInfo: false,
      menuProps: {
        children: 'children',
        label: 'menu_name'
      },
      formMenu: []
    }
  },
  created() {
    this.height = screenHeight()
    this.userList()
  },
  methods: {
    loadOpen() {
      this.loading = true
    },
    loadClose() {
      const that = this
      setTimeout(function() {
        that.loading = false
      }, that.loadingTime)
    },
    message(msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    handleClose(done) {
      this.userReset()
      done()
    },
    userList() {
      this.loadOpen()
      userList(this.userQuery)
        .then(res => {
          this.userData = res.data.list
          this.userCount = res.data.count
          this.loadClose()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    userSort(sort) {
      this.userQuery.order_field = sort.prop
      this.userQuery.order_type = ''
      if (sort.order === 'ascending') {
        this.userQuery.order_type = 'asc'
        this.userList()
      }
      if (sort.order === 'descending') {
        this.userQuery.order_type = 'desc'
        this.userList()
      }
    },
    userSearch() {
      this.userQuery.page = 1
      this.userList()
    },
    userRefresh() {
      this.userQuery = { page: 1, limit: 10 }
      this.userList()
    },
    userAddition() {
      this.userDialog = true
      this.userReset()
    },
    userModify(row) {
      this.userDialog = true
      userInfo({ admin_user_id: row.admin_user_id }).then(res => {
        this.userReset(res.data)
      })
    },
    userEditRule(row) {
      this.userDialogRule = true
      this.menuList()
      this.userReset(row)
      this.ruleList()
      this.userRuleInfo(row)
    },
    userIsSuperAdmin(row) {
      this.loadOpen()
      userSuperAdmin(row)
        .then(res => {
          this.message(res.msg)
          this.userList()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    userIsProhibit(row) {
      this.loadOpen()
      userProhibit(row)
        .then(res => {
          this.message(res.msg)
          this.userList()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    menuCheck(data, node) {
      this.userModel.admin_menu_id = node.checkedKeys
    },
    menuList() {
      menuList().then(res => {
        this.formMenu = res.data.list
      })
    },
    userEditRuleInfo(row) {
      this.userDialogRuleInfo = true
      this.menuList()
      this.ruleList()
      this.userRuleInfo(row)
    },
    userRuleInfo(row) {
      userRuleInfo({ admin_user_id: row.admin_user_id }).then(res => {
        this.userReset(res.data)
      })
    },
    userPassword(row) {
      this.userDialogPwd = true
      this.userReset(row)
    },
    userDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadOpen()
          userDele({ admin_user_id: row.admin_user_id })
            .then(res => {
              this.message(res.msg)
              this.userReset()
              this.userList()
            })
            .catch(() => {
              this.loadClose()
            })
        })
        .catch(() => {})
    },
    ruleList() {
      ruleList({ page: 1, limit: 9999 }).then(res => {
        this.formRule = res.data.list
      })
    },
    userReset(row) {
      const data = this.userModel
      data.admin_rule_ids = []
      data.admin_menu_ids = []
      data.admin_menu_id = []
      if (row) {
        data.admin_user_id = row.admin_user_id
        data.admin_rule_ids = row.admin_rule_ids ? row.admin_rule_ids : []
        data.admin_menu_ids = row.admin_menu_ids ? row.admin_menu_ids : []
        data.admin_menu_id = row.admin_menu_id ? row.admin_menu_id : []
        data.username = row.username
        data.nickname = row.nickname
        data.password = ''
        data.email = row.email ? row.email : ''
        data.remark = row.remark ? row.remark : ''
        data.sort = row.sort
        data.create_time = row.create_time ? row.create_time : ''
        data.update_time = row.update_time ? row.update_time : ''
        data.logout_time = row.logout_time ? row.logout_time : ''
        data.avatar = row.avatar ? row.avatar : ''
      } else {
        data.admin_user_id = ''
        data.admin_rule_ids = []
        data.admin_menu_ids = []
        data.admin_menu_id = []
        data.username = ''
        data.nickname = ''
        data.password = ''
        data.email = ''
        data.remark = ''
        data.sort = 200
      }
    },
    userCancelRule() {
      this.userDialogRule = false
      this.userReset()
    },
    userSubmitRule() {
      this.$refs['formRuleRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          userRule(this.userModel)
            .then(res => {
              this.userDialogRule = false
              this.message(res.msg)
              this.userReset()
              this.userList()
            })
            .catch(() => {
              this.loadClose()
            })
        }
      })
    },
    userCancelPwd() {
      this.userDialogPwd = false
      this.userReset()
    },
    userSubmitPwd() {
      this.$refs['formPwdRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          userPwd(this.userModel)
            .then(res => {
              this.userDialogPwd = false
              this.message(res.msg)
              this.userReset()
              this.userList()
            })
            .catch(() => {
              this.loadClose()
            })
        }
      })
    },
    userCancel() {
      this.userDialog = false
      this.userReset()
    },
    userSubmit() {
      this.$refs['userRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          if (this.userModel.admin_user_id) {
            userEdit(this.userModel)
              .then(res => {
                this.userDialog = false
                this.message(res.msg)
                this.userReset()
                this.userList()
              })
              .catch(() => {
                this.loadClose()
              })
          } else {
            userAdd(this.userModel)
              .then(res => {
                this.userDialog = false
                this.message(res.msg)
                this.userReset()
                this.userList()
              })
              .catch(() => {
                this.loadClose()
              })
          }
        }
      })
    }
  }
}
</script>
