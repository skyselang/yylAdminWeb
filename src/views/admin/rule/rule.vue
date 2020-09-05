<template>
  <div class="app-container">
    <!-- 权限查询 -->
    <div class="filter-container">
      <el-input v-model="ruleQuery.rule_name" class="filter-item" style="width: 200px;" placeholder="权限" clearable />
      <el-input v-model="ruleQuery.rule_desc" class="filter-item" style="width: 200px;" placeholder="描述" clearable />
      <el-button class="filter-item" type="primary" @click="ruleSearch">查询</el-button>
      <el-button class="filter-item" type="primary" style="float:right;margin-left:10px" @click="ruleAddition">添加</el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="ruleRefresh">刷新</el-button>
    </div>
    <!-- 权限列表 -->
    <el-table v-loading="loading" :data="ruleData" :height="height" style="width: 100%" border @sort-change="ruleSort">
      <el-table-column prop="admin_rule_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="rule_name" label="权限" min-width="120" />
      <el-table-column prop="rule_desc" label="描述" min-width="130" />
      <el-table-column prop="rule_sort" label="排序" min-width="100" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" sortable="custom" />
      <el-table-column prop="is_prohibit" label="是否禁用" min-width="110" align="center" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_prohibit" active-value="1" inactive-value="0" @change="ruleIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="220" align="right" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="userListShow(row)">用户</el-button>
          <el-button size="mini" type="primary" @click="ruleModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="ruleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 权限分页 -->
    <pagination v-show="ruleCount > 0" :total="ruleCount" :page.sync="ruleQuery.page" :limit.sync="ruleQuery.limit" @pagination="ruleList" />
    <!-- 权限添加、修改 -->
    <el-dialog :title="ruleModel.dialog_title" :visible.sync="ruleDialog" top="1vh">
      <el-form ref="ruleRef" :rules="ruleRules" :model="ruleModel" label-width="100px" class="dialog-body" :style="{height:height+80+'px'}">
        <el-form-item label="权限" prop="rule_name">
          <el-input v-model="ruleModel.rule_name" placeholder="请输入权限名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="rule_desc">
          <el-input v-model="ruleModel.rule_desc" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="rule_sort">
          <el-input v-model="ruleModel.rule_sort" type="number" />
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="menuRef"
            :data="menuData"
            :default-checked-keys="ruleModel.admin_menu_ids"
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
              <span v-if="data.children[0]">
                <el-button type="text" size="mini" @click="() => menuChildrenAllCheck(data)">全选</el-button>
                <el-button type="text" size="mini" @click="() => menuChildrenAllCheck(data, true)">反选</el-button>
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
    <!-- 用户列表 -->
    <el-dialog :title="userTitle" :visible.sync="userDialog" width="65%" top="1vh">
      <el-table v-loading="userLoad" :data="userData" :height="height+20" style="width: 100%" border @sort-change="userSort">
        <el-table-column prop="admin_user_id" label="ID" min-width="100" sortable="custom" fixed="left" />
        <el-table-column prop="username" label="账号" min-width="120" sortable="custom" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
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
  ruleList,
  ruleProhibit,
  ruleAdd,
  ruleEdit,
  ruleDele,
  userList
} from '@/api/admin'

export default {
  name: 'Rule',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      loadingTime: 0,
      menuData: [],
      menuProps: {
        children: 'children',
        label: 'menu_name'
      },
      ruleDialog: false,
      ruleData: [],
      ruleCount: 0,
      ruleQuery: {
        page: 1,
        limit: 10
      },
      ruleModel: {
        dialog_title: '',
        admin_rule_id: '',
        admin_menu_ids: [],
        rule_name: '',
        rule_desc: '',
        rule_sort: '',
        is_prohibit: '0'
      },
      ruleRules: {
        rule_name: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      userDialog: false,
      userLoad: false,
      userData: [],
      userCount: 0,
      userQuery: {},
      userTitle: ''
    }
  },
  created() {
    this.height = screenHeight()
    this.ruleList()
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
    // 菜单列表
    menuList() {
      menuList().then(res => {
        this.menuData = res.data.list
      })
    },
    // 菜单选择
    menuCheck(data, node) {
      this.ruleModel.admin_menu_ids = node.checkedKeys
    },
    // 菜单子菜单全选反选
    menuChildrenAllCheck(data, back = false) {
      const admin_menu_ids = this.ruleModel.admin_menu_ids
      const admin_menu_ids_child = []
      admin_menu_ids_child.push(data.admin_menu_id)
      for (let i = 0; i < data.children.length; i++) {
        admin_menu_ids_child.push(data.children[i].admin_menu_id)
      }
      if (back) {
        for (let i = 0; i < admin_menu_ids.length; i++) {
          for (let j = 0; j < admin_menu_ids_child.length; j++) {
            if (admin_menu_ids[i] === admin_menu_ids_child[j]) {
              admin_menu_ids.splice(i, 1)
            }
          }
        }
        this.ruleModel.admin_menu_ids = admin_menu_ids
        this.$refs.menuRef.setCheckedKeys(admin_menu_ids)
      } else {
        const admin_menu_ids_temp = []
        const admin_menu_ids_all = admin_menu_ids.concat(admin_menu_ids_child)
        for (let i = 0; i < admin_menu_ids_all.length; i++) {
          if (admin_menu_ids_temp.indexOf(admin_menu_ids_all[i]) === -1) {
            admin_menu_ids_temp.push(admin_menu_ids_all[i])
          }
        }
        this.ruleModel.admin_menu_ids = admin_menu_ids_temp
        this.$refs.menuRef.setCheckedKeys(admin_menu_ids_temp)
      }
    },
    // 权限列表
    ruleList() {
      this.loadOpen()
      ruleList(this.ruleQuery)
        .then(res => {
          this.ruleData = res.data.list
          this.ruleCount = res.data.count
          this.loadClose()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    // 权限排序
    ruleSort(sort) {
      this.ruleQuery.sort_field = sort.prop
      this.ruleQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.ruleQuery.sort_type = 'asc'
        this.ruleList()
      }
      if (sort.order === 'descending') {
        this.ruleQuery.sort_type = 'desc'
        this.ruleList()
      }
    },
    // 权限查询
    ruleSearch() {
      this.ruleQuery.page = 1
      this.ruleList()
    },
    // 权限刷新
    ruleRefresh() {
      this.ruleQuery = { page: 1, limit: 10 }
      this.ruleList()
    },
    // 权限添加
    ruleAddition() {
      this.ruleDialog = true
      this.menuList()
      this.ruleReset()
    },
    // 权限修改
    ruleModify(row) {
      this.ruleDialog = true
      this.menuList()
      this.ruleReset(row)
    },
    // 权限删除
    ruleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadOpen()
          ruleDele({ admin_rule_id: row.admin_rule_id })
            .then(res => {
              this.message(res.msg)
              this.ruleReset()
              this.ruleList()
            })
            .catch(() => {
              this.loadClose()
            })
        })
        .catch(() => {})
    },
    // 权限是否禁用
    ruleIsProhibit(row) {
      this.loadOpen()
      ruleProhibit(row)
        .then(res => {
          this.message(res.msg)
          this.ruleList()
        })
        .catch(() => {
          this.loadOpen()
        })
    },
    // 权限添加、修改重置
    ruleReset(row) {
      if (row) {
        this.ruleModel.dialog_title = '权限修改：' + row.rule_name
        this.ruleModel.admin_rule_id = row.admin_rule_id
        this.ruleModel.admin_menu_ids = row.admin_menu_ids
        this.ruleModel.rule_name = row.rule_name
        this.ruleModel.rule_desc = row.rule_desc
        this.ruleModel.rule_sort = row.rule_sort
      } else {
        this.ruleModel.dialog_title = '权限添加'
        this.ruleModel.admin_rule_id = ''
        this.ruleModel.admin_menu_ids = []
        this.ruleModel.rule_name = ''
        this.ruleModel.rule_desc = ''
        this.ruleModel.rule_sort = 200
      }
    },
    // 权限添加、修改取消
    ruleCancel() {
      this.ruleDialog = false
      this.ruleReset()
    },
    // 权限添加、修改提交
    ruleSubmit() {
      this.$refs['ruleRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          if (this.ruleModel.admin_rule_id) {
            ruleEdit(this.ruleModel)
              .then(res => {
                this.ruleDialog = false
                this.message(res.msg)
                this.ruleReset()
                this.ruleList()
              })
              .catch(() => {
                this.loadClose()
              })
          } else {
            ruleAdd(this.ruleModel)
              .then(res => {
                this.ruleDialog = false
                this.message(res.msg)
                this.ruleReset()
                this.ruleList()
              })
              .catch(() => {
                this.loadClose()
              })
          }
        }
      })
    },
    // 用户列表显示
    userListShow(row) {
      this.userDialog = true
      this.userTitle = row.rule_name
      this.userQuery.admin_rule_id = row.admin_rule_id
      this.userList()
    },
    // 用户列表
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
    // 用户排序
    userSort(sort) {
      this.userQuery.sort_field = sort.prop
      this.userQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.userQuery.sort_type = 'asc'
        this.userList()
      }
      if (sort.order === 'descending') {
        this.userQuery.sort_type = 'desc'
        this.userList()
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
