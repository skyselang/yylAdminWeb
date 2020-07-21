<template>
  <div class="app-container">
    <div>
      <!-- user search -->
      <div class="filter-container">
        <el-input v-model="tableQuery.username" placeholder="账号" style="width: 200px;" class="filter-item" clearable />
        <el-input v-model="tableQuery.nickname" placeholder="昵称" style="width: 200px;" class="filter-item" clearable />
        <el-button class="filter-item" type="primary" @click="tableSearch">
          查询
        </el-button>
        <el-button class="filter-item" style="float:right;margin-left:10px" type="primary" @click="tableAdd">
          添加
        </el-button>
        <el-button class="filter-item" style="float:right;" type="primary" @click="tableReset">
          刷新
        </el-button>
      </div>
      <!-- user table -->
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" @sort-change="tableSort">
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
            <el-switch v-model="scope.row.is_super_admin" active-value="1" inactive-value="0" @change="tableSuperAdmin(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="is_prohibit" label="是否禁用" min-width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_prohibit" active-value="1" inactive-value="0" @change="tableProhibit(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="is_prohibit" label="权限" min-width="150" align="center">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="tableEditRule(row)">
              分配
            </el-button>
            <el-button size="mini" type="primary" @click="tableEditRuleInfo(row)">
              明细
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="password" label="密码" width="80" align="center">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="tableEditPwd(row)">
              密码
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" align="right" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="tableEdit(row)">
              修改
            </el-button>
            <el-button size="mini" type="danger" @click="tableDele(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- user page -->
      <pagination v-show="tableCount > 0" :total="tableCount" :page.sync="tableQuery.page" :limit.sync="tableQuery.limit" @pagination="tableList" />
      <!-- user edit、add -->
      <el-dialog :title="formData.admin_user_id ? '修改' : '添加'" :visible.sync="formVisible" :before-close="handleClose">
        <el-form ref="formRef" :rules="formRules" :model="formData" label-position="right" label-width="120px" style="width: 80%; margin-left:50px;">
          <el-form-item v-if="formData.admin_user_id && formData.avatar" label="头像">
            <el-avatar shape="circle" fit="contain" :size="100" :src="formData.avatar" />
          </el-form-item>
          <el-form-item label="账号" prop="username">
            <el-input v-model="formData.username" placeholder="请输入账号" clearable />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="formData.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
          <el-form-item v-if="formData.admin_user_id == ''" label="密码" prop="password">
            <el-input v-model="formData.password" placeholder="请输入密码" clearable show-password />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" clearable />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="formData.sort" type="number" />
          </el-form-item>
          <el-form-item v-if="formData.admin_user_id" label="添加时间" prop="create_time">
            <el-input v-model="formData.create_time" placeholder="" disabled />
          </el-form-item>
          <el-form-item v-if="formData.admin_user_id" label="更新时间" prop="update_time">
            <el-input v-model="formData.update_time" placeholder="" disabled />
          </el-form-item>
          <el-form-item v-if="formData.admin_user_id" label="退出时间" prop="logout_time">
            <el-input v-model="formData.logout_time" placeholder="" disabled />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="formCancel">
            取消
          </el-button>
          <el-button type="primary" @click="formSubmit">
            提交
          </el-button>
        </div>
      </el-dialog>
      <!-- 权限分配 -->
      <el-dialog title="权限分配" :visible.sync="formVisibleRule" top="1vh" :before-close="handleClose">
        <el-form ref="formRuleRef" :model="formData" label-position="right" label-width="120px" style="width: 80%; margin-left:50px;">
          <el-form-item label="账号">
            <el-input v-model="formData.username" clearable disabled />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="formData.nickname" clearable disabled />
          </el-form-item>
          <el-form-item label="按权限">
            <el-checkbox-group v-model="formData.admin_rule_ids">
              <el-checkbox v-for="item in formRule" :key="item.admin_rule_id" :label="item.admin_rule_id">{{ item.rule_name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="按菜单">
            <el-tree
              ref="formMenuRef"
              :data="formMenu"
              :default-checked-keys="formData.admin_menu_id"
              :props="menuProps"
              :expand-on-click-node="false"
              node-key="admin_menu_id"
              default-expand-all
              show-checkbox
              check-strictly
              highlight-current
              @check="formMenuCheck"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span v-if="formData.admin_menu_ids.includes(data.admin_menu_id)">
                  <i class="el-icon-check" />
                </span>
              </span>
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="formCancelRule">
            取消
          </el-button>
          <el-button type="primary" @click="formSubmitRule">
            提交
          </el-button>
        </div>
      </el-dialog>
      <!-- 权限明细 -->
      <el-dialog title="权限明细" :visible.sync="formVisibleRuleInfo" top="1vh" :before-close="handleClose">
        <el-form ref="formRuleInfoRef" :model="formData" label-position="right" label-width="120px" style="width: 80%; margin-left:50px;">
          <el-form-item label="账号">
            <el-input v-model="formData.username" clearable disabled />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="formData.nickname" clearable disabled />
          </el-form-item>
          <el-form-item label="菜单">
            <el-tree ref="formMenuRef" :data="formMenu" :default-checked-keys="formData.admin_menu_ids" :props="menuProps" :expand-on-click-node="false" node-key="admin_menu_id" default-expand-all show-checkbox check-strictly highlight-current>
              <span slot-scope="{ node }" class="custom-tree-node">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 密码重置 -->
      <el-dialog title="密码重置" :visible.sync="formVisiblePwd" :before-close="handleClose">
        <el-form ref="formPwdRef" :rules="rePwdRules" :model="formData" label-position="right" label-width="120px" style="width: 80%; margin-left:50px;">
          <el-form-item label="账号">
            <el-input v-model="formData.username" clearable disabled />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="formData.nickname" clearable disabled />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="formData.password" placeholder="请输入新密码" clearable show-password />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="formCancelPwd">
            取消
          </el-button>
          <el-button type="primary" @click="formSubmitPwd">
            提交
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
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
import Pagination from '@/components/Pagination'

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      loading: false,
      loadingTime: 0,
      tableData: [],
      tableCount: 0,
      tableQuery: {
        page: 1,
        limit: 10
      },
      formVisible: false,
      formVisibleRule: false,
      formVisiblePwd: false,
      formRule: [],
      formData: {
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
      formRules: {
        username: [{ required: true, message: '必填', trigger: 'blur' }],
        nickname: [{ required: true, message: '必填', trigger: 'blur' }],
        password: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      rePwdRules: {
        password: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      formVisibleRuleInfo: false,
      menuProps: {
        children: 'children',
        label: 'menu_name'
      },
      formMenu: []
    }
  },
  created() {
    this.tableList()
  },
  methods: {
    loadingOpen() {
      this.loading = true
    },
    loadingClose() {
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
      this.formReset()
      done()
    },
    tableList() {
      this.loadingOpen()
      userList(this.tableQuery)
        .then(res => {
          this.tableData = res.data.list
          this.tableCount = res.data.count
          this.loadingClose()
        })
        .catch(() => {
          this.loadingClose()
        })
    },
    tableSort(sort) {
      this.tableQuery.order_field = sort.prop
      this.tableQuery.order_type = ''
      if (sort.order === 'ascending') {
        this.tableQuery.order_type = 'asc'
        this.tableList()
      }
      if (sort.order === 'descending') {
        this.tableQuery.order_type = 'desc'
        this.tableList()
      }
    },
    tableSuperAdmin(row) {
      this.loadingOpen()
      userSuperAdmin(row)
        .then(res => {
          this.message(res.msg)
          this.tableList()
        })
        .catch(() => {
          this.loadingClose()
        })
    },
    tableProhibit(row) {
      this.loadingOpen()
      userProhibit(row)
        .then(res => {
          this.message(res.msg)
          this.tableList()
        })
        .catch(() => {
          this.loadingClose()
        })
    },
    tableSearch() {
      this.tableQuery.page = 1
      this.tableList()
    },
    tableReset() {
      this.tableQuery = { page: 1, limit: 10 }
      this.tableList()
    },
    tableAdd() {
      this.formVisible = true
      this.formReset()
    },
    tableEdit(row) {
      this.formVisible = true
      userInfo({ admin_user_id: row.admin_user_id }).then(res => {
        this.formReset(res.data)
      })
    },
    tableEditRule(row) {
      this.formVisibleRule = true
      this.formMenuList()
      this.formReset(row)
      this.formRuleList()
      this.userRuleInfo(row)
    },
    formMenuCheck(data, node) {
      this.formData.admin_menu_id = node.checkedKeys
    },
    formMenuList() {
      menuList().then(res => {
        this.formMenu = res.data.list
      })
    },
    tableEditRuleInfo(row) {
      this.formVisibleRuleInfo = true
      this.formMenuList()
      this.userRuleInfo(row)
    },
    userRuleInfo(row) {
      userRuleInfo({ admin_user_id: row.admin_user_id }).then(res => {
        this.formReset(res.data)
      })
    },
    tableEditPwd(row) {
      this.formVisiblePwd = true
      this.formReset(row)
    },
    tableDele(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadingOpen()
          userDele({ admin_user_id: row.admin_user_id })
            .then(res => {
              this.message(res.msg)
              this.formReset()
              this.tableList()
            })
            .catch(() => {
              this.loadingClose()
            })
        })
        .catch(() => {})
    },
    formRuleList() {
      ruleList({ page: 1, limit: 9999 }).then(res => {
        this.formRule = res.data.list
      })
    },
    formReset(row) {
      const data = this.formData
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
    formCancelRule() {
      this.formVisibleRule = false
      this.formReset()
    },
    formSubmitRule() {
      this.$refs['formRuleRef'].validate(valid => {
        if (valid) {
          this.loadingOpen()
          userRule(this.formData)
            .then(res => {
              this.formVisibleRule = false
              this.message(res.msg)
              this.formReset()
              this.tableList()
            })
            .catch(() => {
              this.loadingClose()
            })
        }
      })
    },
    formCancelPwd() {
      this.formVisiblePwd = false
      this.formReset()
    },
    formSubmitPwd() {
      this.$refs['formPwdRef'].validate(valid => {
        if (valid) {
          this.loadingOpen()
          userPwd(this.formData)
            .then(res => {
              this.formVisiblePwd = false
              this.message(res.msg)
              this.formReset()
              this.tableList()
            })
            .catch(() => {
              this.loadingClose()
            })
        }
      })
    },
    formCancel() {
      this.formVisible = false
      this.formReset()
    },
    formSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.loadingOpen()
          if (this.formData.admin_user_id) {
            userEdit(this.formData)
              .then(res => {
                this.formVisible = false
                this.message(res.msg)
                this.formReset()
                this.tableList()
              })
              .catch(() => {
                this.loadingClose()
              })
          } else {
            userAdd(this.formData)
              .then(res => {
                this.formVisible = false
                this.message(res.msg)
                this.formReset()
                this.tableList()
              })
              .catch(() => {
                this.loadingClose()
              })
          }
        }
      })
    }
  }
}
</script>
