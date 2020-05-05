<template>
  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input
          v-model="tableQuery.username"
          placeholder="账号"
          style="width: 200px;"
          class="filter-item"
          clearable
        />
        <el-input
          v-model="tableQuery.nickname"
          placeholder="昵称"
          style="width: 200px;"
          class="filter-item"
          clearable
        />
        <el-button class="filter-item" type="primary" @click="tableSearch">
          查询
        </el-button>
        <el-button
          class="filter-item"
          style="float:right;margin-left:10px"
          type="primary"
          @click="tableAdd"
        >
          添加
        </el-button>
        <el-button
          class="filter-item"
          style="float:right;"
          type="primary"
          @click="tableReset"
        >
          刷新
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        @sort-change="tableSort"
      >
        <el-table-column
          prop="admin_user_id"
          label="ID"
          width="80"
          sortable="custom"
        />
        <el-table-column
          prop="username"
          label="账号"
          min-width="110"
          sortable="custom"
        />
        <el-table-column prop="nickname" label="昵称" min-width="110" />
        <el-table-column prop="remark" label="备注" min-width="110" />
        <el-table-column
          prop="sort"
          label="排序"
          width="80"
          sortable="custom"
        />
        <el-table-column
          prop="login_num"
          label="登录次数"
          width="110"
          sortable="custom"
        />
        <el-table-column prop="login_ip" label="登录IP" width="130" />
        <el-table-column
          prop="login_time"
          label="登录时间"
          width="160"
          sortable="custom"
        />
        <el-table-column
          prop="insert_time"
          label="添加时间"
          width="160"
          sortable="custom"
        />
        <el-table-column
          prop="is_super_admin"
          label="是否超管"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_super_admin"
              active-value="1"
              inactive-value="0"
              @change="tableSuperAdmin(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="is_prohibit"
          label="是否禁用"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_prohibit"
              active-value="1"
              inactive-value="0"
              @change="tableProhibit(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="is_prohibit"
          label="权限"
          width="80"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="tableEditRule(row)">
              权限
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
        <el-table-column
          label="操作"
          width="150"
          align="right"
          class-name="small-padding fixed-width"
        >
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

      <pagination
        v-show="tableCount > 0"
        :total="tableCount"
        :page.sync="tableQuery.page"
        :limit.sync="tableQuery.limit"
        @pagination="tableList"
      />

      <el-dialog title="权限分配" :visible.sync="formVisibleRule">
        <el-form
          ref="formRuleRef"
          :model="formData"
          label-position="right"
          label-width="120px"
          style="width: 80%; margin-left:50px;"
        >
          <el-form-item label="账号">
            <el-input v-model="formData.username" clearable disabled />
          </el-form-item>
          <el-form-item label="权限">
            <el-checkbox-group v-model="formData.admin_rule_ids">
              <el-checkbox
                v-for="item in formRule"
                :key="item.admin_rule_id"
                :label="item.admin_rule_id"
              >{{ item.rule_name }}</el-checkbox>
            </el-checkbox-group>
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

      <el-dialog title="密码重置" :visible.sync="formVisiblePwd">
        <el-form
          ref="formPwdRef"
          :rules="{
            password: [{ required: true, message: '必填', trigger: 'blur' }]
          }"
          :model="formData"
          label-position="right"
          label-width="120px"
          style="width: 80%; margin-left:50px;"
        >
          <el-form-item label="账号">
            <el-input v-model="formData.username" clearable disabled />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="formData.password" clearable show-password />
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

      <el-dialog
        :title="formData.admin_user_id ? '修改' : '添加'"
        :visible.sync="formVisible"
      >
        <el-form
          ref="formRef"
          :rules="formRules"
          :model="formData"
          label-position="right"
          label-width="120px"
          style="width: 80%; margin-left:50px;"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="formData.username" clearable />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="formData.nickname" clearable />
          </el-form-item>
          <el-form-item
            v-if="formData.admin_user_id == ''"
            label="密码"
            prop="password"
          >
            <el-input v-model="formData.password" clearable show-password />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="formData.sort" type="number" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" clearable />
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
    </div>
  </div>
</template>

<script>
import {
  userList,
  userSuperAdmin,
  userProhibit,
  userRule,
  userRepwd,
  userAdd,
  userEdit,
  userDele,
  ruleList
} from '@/api/admin'
import Pagination from '@/components/Pagination'

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      loading: false,
      loadingTime: 250,
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
        remark: '',
        sort: '',
        is_prohibit: '0',
        is_super_admin: '0'
      },
      formRules: {
        username: [{ required: true, message: '必填', trigger: 'blur' }],
        nickname: [{ required: true, message: '必填', trigger: 'blur' }],
        password: [{ required: true, message: '必填', trigger: 'blur' }]
      }
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
      this.formReset(row)
    },
    tableEditRule(row) {
      this.formVisibleRule = true
      this.formReset(row)
      this.formRuleList()
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
          this.formData.admin_user_id = row.admin_user_id
          userDele(this.formData)
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
      ruleList().then(res => {
        this.formRule = res.data.list
      })
    },
    formReset(row) {
      if (row) {
        this.formData.admin_user_id = row.admin_user_id
        this.formData.admin_rule_ids = row.admin_rule_ids
        this.formData.username = row.username
        this.formData.nickname = row.nickname
        this.formData.password = ''
        this.formData.remark = row.remark
        this.formData.sort = row.sort
      } else {
        this.formData.admin_user_id = ''
        this.formData.admin_rule_ids = []
        this.formData.username = ''
        this.formData.nickname = ''
        this.formData.password = ''
        this.formData.remark = ''
        this.formData.sort = 200
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
          userRepwd(this.formData)
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
