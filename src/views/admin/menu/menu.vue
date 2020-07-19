<template>
  <div class="app-container">
    <div>
      <!-- search -->
      <div class="filter-container">
        <el-button class="filter-item" style="float:right;margin-left:10px" type="primary" @click="tableAdd">
          添加
        </el-button>
        <el-button class="filter-item" style="float:right;" type="primary" @click="tableReset">
          刷新
        </el-button>
      </div>
      <!-- table -->
      <el-table v-loading="loading" :data="tableData" row-key="admin_menu_id" border style="width: 100%">
        <el-table-column prop="menu_name" label="菜单名称" min-width="180" fixed="left" />
        <el-table-column prop="menu_url" label="菜单链接" min-width="250" />
        <el-table-column prop="menu_sort" label="菜单排序" min-width="100" />
        <el-table-column prop="admin_menu_id" label="ID" min-width="100" />
        <el-table-column prop="menu_pid" label="PID" min-width="100" />
        <el-table-column prop="insert_time" label="添加时间" min-width="160" />
        <el-table-column prop="update_time" label="修改时间" min-width="160" />
        <el-table-column prop="is_prohibit" label="是否禁用" min-width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_prohibit" active-value="1" inactive-value="0" @change="tableProhibit(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="is_unauth" label="无需权限" min-width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_unauth" active-value="1" inactive-value="0" @change="tableUnauth(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="220" fixed="right" align="right" class-name="small-padding fixed-width">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="ruleBtn(row)">
              权限
            </el-button>
            <el-button size="mini" type="primary" @click="tableEdit(row)">
              修改
            </el-button>
            <el-button size="mini" type="danger" @click="tableDele(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- edit、add -->
      <el-dialog :title="formData.admin_menu_id ? '修改' : '添加'" :visible.sync="formVisible">
        <el-form ref="formRef" :rules="formRules" :model="formData" label-position="right" label-width="120px" style="width: 80%; margin-left:50px;">
          <el-form-item label="菜单父级" prop="menu_pid">
            <el-cascader v-model="formData.menu_pid" placeholder="一级菜单" :options="tableData" :props="menuProps" style="width:100%" clearable filterable @change="formMenuChange" />
          </el-form-item>
          <el-form-item label="菜单名称" prop="menu_name">
            <el-input v-model="formData.menu_name" clearable placeholder="请输入菜单名称" />
          </el-form-item>
          <el-form-item label="菜单链接" prop="menu_url">
            <el-input v-model="formData.menu_url" clearable />
          </el-form-item>
          <el-form-item label="菜单排序" prop="menu_sort">
            <el-input v-model="formData.menu_sort" type="number" />
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
      <!-- rule -->
      <el-dialog :title="ruleTitle" :visible.sync="ruleVisible">
        <el-table v-loading="ruleLoad" :data="ruleData" style="width: 100%" border @sort-change="ruleSort">
          <el-table-column prop="admin_rule_id" label="ID" min-width="100" sortable="custom" fixed="left" />
          <el-table-column prop="rule_name" label="权限" min-width="120" />
          <el-table-column prop="rule_desc" label="描述" min-width="130" />
          <el-table-column prop="is_prohibit" label="是否禁用" min-width="110" align="center" sortable="custom">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.is_prohibit" active-value="1" inactive-value="0" disabled />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" align="right" class-name="small-padding fixed-width" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="primary" @click="userBtn(row)">
                用户
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="ruleCount > 0" :total="ruleCount" :page.sync="ruleQuery.page" :limit.sync="ruleQuery.limit" @pagination="ruleList" />
      </el-dialog>
      <!-- user -->
      <el-dialog :title="userTitle" :visible.sync="userVisible">
        <el-table v-loading="userLoad" :data="userData" style="width: 100%" border @sort-change="userSort">
          <el-table-column prop="admin_user_id" label="ID" min-width="80" sortable="custom" fixed="left" />
          <el-table-column prop="username" label="账号" min-width="200" sortable="custom" />
          <el-table-column prop="nickname" label="昵称" min-width="110" />
          <el-table-column prop="email" label="邮箱" min-width="100" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" width="100" />
          <el-table-column prop="is_super_admin" label="是否超管" min-width="80" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.is_super_admin" active-value="1" inactive-value="0" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="is_prohibit" label="是否禁用" min-width="80" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.is_prohibit" active-value="1" inactive-value="0" disabled />
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="userList" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  menuList,
  menuAdd,
  menuEdit,
  menuDele,
  menuProhibit,
  menuUnauth,
  ruleList,
  userList
} from '@/api/admin'
import Pagination from '@/components/Pagination'

export default {
  name: 'Menu',
  components: { Pagination },
  data() {
    return {
      loading: false,
      loadingTime: 0,
      tableData: [],
      tableCount: 0,
      tableQuery: {},
      formVisible: false,
      menuProps: {
        checkStrictly: true,
        value: 'admin_menu_id',
        label: 'menu_name'
      },
      formData: {
        admin_menu_id: '',
        menu_pid: 0,
        menu_name: '',
        menu_url: '',
        menu_sort: 200
      },
      formRules: {
        menu_name: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      ruleLoad: false,
      ruleData: [],
      ruleCount: 0,
      ruleQuery: {
        page: 1,
        limit: 10
      },
      ruleVisible: false,
      ruleTitle: '',
      userLoad: false,
      userData: [],
      userCount: 0,
      userQuery: {
        page: 1,
        limit: 10
      },
      userVisible: false,
      userTitle: ''
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
      menuList(this.tableQuery)
        .then(res => {
          this.tableData = res.data.list
          this.tableCount = res.data.count
          this.loadingClose()
        })
        .catch(() => {
          this.loadingClose()
        })
    },
    tableProhibit(row) {
      this.loadingOpen()
      menuProhibit(row)
        .then(res => {
          this.message(res.msg)
          this.tableList()
        })
        .catch(() => {
          this.loadingClose()
        })
    },
    tableUnauth(row) {
      this.loadingOpen()
      menuUnauth(row)
        .then(res => {
          this.message(res.msg)
          this.tableList()
        })
        .catch(() => {
          this.loadingClose()
        })
    },
    tableReset() {
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
    tableDele(row) {
      this.$confirm('确定删除吗（它所有子菜单也将删除）？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadingOpen()
          menuDele({ admin_menu_id: row.admin_menu_id })
            .then(res => {
              this.$message(res.msg)
              this.formReset()
              this.tableList()
            })
            .catch(() => {
              this.loadingClose()
            })
        })
        .catch(() => {})
    },
    formMenuChange(value) {
      this.formData.menu_pid = value[value.length - 1]
    },
    formReset(row) {
      if (row) {
        this.formData.admin_menu_id = row.admin_menu_id
        this.formData.menu_pid = row.menu_pid
        this.formData.menu_name = row.menu_name
        this.formData.menu_url = row.menu_url
        this.formData.menu_sort = row.menu_sort
      } else {
        this.formData.admin_menu_id = ''
        this.formData.menu_pid = 0
        this.formData.menu_name = ''
        this.formData.menu_url = ''
        this.formData.menu_sort = 200
      }
    },
    formCancel() {
      this.formVisible = false
      this.formReset()
    },
    formSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.loadingOpen()
          if (this.formData.admin_menu_id) {
            menuEdit(this.formData)
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
            menuAdd(this.formData)
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
    },
    // rule
    ruleBtn(row) {
      this.ruleVisible = true
      this.ruleTitle = row.menu_name
      this.ruleQuery.admin_menu_id = row.admin_menu_id
      this.ruleList()
    },
    ruleList() {
      this.ruleLoad = true
      ruleList(this.ruleQuery)
        .then(res => {
          this.ruleData = res.data.list
          this.ruleCount = res.data.count
          this.ruleLoad = false
        })
        .catch(() => {
          this.ruleLoad = false
        })
    },
    ruleSort(sort) {
      this.ruleQuery.order_field = sort.prop
      this.ruleQuery.order_type = ''
      if (sort.order === 'ascending') {
        this.ruleQuery.order_type = 'asc'
        this.ruleList()
      }
      if (sort.order === 'descending') {
        this.ruleQuery.order_type = 'desc'
        this.ruleList()
      }
    },
    // user
    userBtn(row) {
      this.userVisible = true
      this.userTitle = row.rule_name
      this.userQuery.admin_rule_id = row.admin_rule_id
      this.userList()
    },
    userList() {
      this.userLoad = true
      userList(this.userQuery)
        .then(res => {
          this.userData = res.data.list
          this.userCount = res.data.count
          this.userLoad = false
        })
        .catch(() => {
          this.userLoad = false
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
    }
  }
}
</script>
