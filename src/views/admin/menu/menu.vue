<template>
  <div class="app-container">
    <!-- 添加 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="float:right;margin-left:10px" @click="menuAddition">
        添加
      </el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="menuRefresh">
        刷新
      </el-button>
    </div>
    <!-- 菜单 -->
    <el-table v-loading="loading" :data="menuData" :height="height+100" style="width: 100%" row-key="admin_menu_id" border>
      <el-table-column prop="menu_name" label="菜单名称" min-width="180" fixed="left" />
      <el-table-column prop="menu_url" label="菜单链接" min-width="250" />
      <el-table-column prop="menu_sort" label="菜单排序" min-width="100" />
      <el-table-column prop="admin_menu_id" label="ID" min-width="100" />
      <el-table-column prop="menu_pid" label="PID" min-width="100" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" />
      <el-table-column prop="is_prohibit" label="是否禁用" min-width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_prohibit" active-value="1" inactive-value="0" @change="menuIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unauth" label="无需权限" min-width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_unauth" active-value="1" inactive-value="0" @change="menuIsUnauth(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="220" fixed="right" align="right" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="ruleListShow(row)">
            权限
          </el-button>
          <el-button size="mini" type="primary" @click="menuModify(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="menuDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑 -->
    <el-dialog :title="menuModel.admin_menu_id ? '修改' : '添加'" :visible.sync="menuDialog" top="1vh">
      <el-form ref="formRef" :rules="menuRules" :model="menuModel" label-width="80px" class="dialog-body" :style="{height:height+50+'px'}">
        <el-form-item label="菜单父级" prop="menu_pid">
          <el-cascader v-model="menuModel.menu_pid" :options="menuData" :props="menuProps" style="width:100%" clearable filterable placeholder="一级菜单" @change="menuPidChange" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="menuModel.menu_name" clearable placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单链接" prop="menu_url">
          <el-input v-model="menuModel.menu_url" clearable />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menu_sort">
          <el-input v-model="menuModel.menu_sort" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuCancel">
          取消
        </el-button>
        <el-button type="primary" @click="menuSubmit">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!-- 权限 -->
    <el-dialog :title="ruleTitle" :visible.sync="ruleDialog" width="65%" top="1vh">
      <el-table v-loading="ruleLoad" :data="ruleData" :height="height+30" style="width: 100%" border @sort-change="ruleSort">
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
            <el-button size="mini" type="primary" @click="userListShow(row)">
              用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="ruleCount > 0" :total="ruleCount" :page.sync="ruleQuery.page" :limit.sync="ruleQuery.limit" @pagination="ruleData" />
    </el-dialog>
    <!-- 用户 -->
    <el-dialog :title="userTitle" :visible.sync="userDialog" width="62%" top="1vh">
      <el-table v-loading="userLoad" :data="userData" :height="height+20" style="width: 100%" border @sort-change="userSort">
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
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
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

export default {
  name: 'Menu',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      loadingTime: 0,
      menuData: [],
      menuCount: 0,
      menuQuery: {},
      menuDialog: false,
      menuProps: {
        checkStrictly: true,
        value: 'admin_menu_id',
        label: 'menu_name'
      },
      menuModel: {
        admin_menu_id: '',
        menu_pid: 0,
        menu_name: '',
        menu_url: '',
        menu_sort: 200
      },
      menuRules: {
        menu_name: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      ruleLoad: false,
      ruleData: [],
      ruleCount: 0,
      ruleQuery: {
        page: 1,
        limit: 10
      },
      ruleDialog: false,
      ruleTitle: '',
      userLoad: false,
      userData: [],
      userCount: 0,
      userQuery: {
        page: 1,
        limit: 10
      },
      userDialog: false,
      userTitle: ''
    }
  },
  created() {
    this.height = screenHeight()
    this.menuList()
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
    menuList() {
      this.loadOpen()
      menuList(this.menuQuery)
        .then(res => {
          this.menuData = res.data.list
          this.menuCount = res.data.count
          this.loadClose()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    menuIsProhibit(row) {
      this.loadOpen()
      menuProhibit(row)
        .then(res => {
          this.message(res.msg)
          this.menuList()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    menuIsUnauth(row) {
      this.loadOpen()
      menuUnauth(row)
        .then(res => {
          this.message(res.msg)
          this.menuList()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    menuRefresh() {
      this.menuList()
    },
    menuAddition() {
      this.menuDialog = true
      this.menuReset()
    },
    menuModify(row) {
      this.menuDialog = true
      this.menuReset(row)
    },
    menuDelete(row) {
      this.$confirm('确定删除吗（它所有子菜单也将删除）？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadOpen()
          menuDele({ admin_menu_id: row.admin_menu_id })
            .then(res => {
              this.$message(res.msg)
              this.menuReset()
              this.menuList()
            })
            .catch(() => {
              this.loadClose()
            })
        })
        .catch(() => {})
    },
    menuPidChange(value) {
      this.menuModel.menu_pid = value[value.length - 1]
    },
    menuReset(row) {
      if (row) {
        this.menuModel.admin_menu_id = row.admin_menu_id
        this.menuModel.menu_pid = row.menu_pid
        this.menuModel.menu_name = row.menu_name
        this.menuModel.menu_url = row.menu_url
        this.menuModel.menu_sort = row.menu_sort
      } else {
        this.menuModel.admin_menu_id = ''
        this.menuModel.menu_pid = 0
        this.menuModel.menu_name = ''
        this.menuModel.menu_url = ''
        this.menuModel.menu_sort = 200
      }
    },
    menuCancel() {
      this.menuDialog = false
      this.menuReset()
    },
    menuSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          if (this.menuModel.admin_menu_id) {
            menuEdit(this.menuModel)
              .then(res => {
                this.menuDialog = false
                this.message(res.msg)
                this.menuReset()
                this.menuList()
              })
              .catch(() => {
                this.loadClose()
              })
          } else {
            menuAdd(this.menuModel)
              .then(res => {
                this.menuDialog = false
                this.message(res.msg)
                this.menuReset()
                this.menuList()
              })
              .catch(() => {
                this.loadClose()
              })
          }
        }
      })
    },
    // 权限
    ruleListShow(row) {
      this.ruleDialog = true
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
    // 用户
    userListShow(row) {
      this.userDialog = true
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
