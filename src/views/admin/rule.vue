<template>
  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input
          v-model="tableQuery.rule_name"
          placeholder="权限"
          style="width: 200px;"
          class="filter-item"
          clearable
        />
        <el-input
          v-model="tableQuery.rule_desc"
          placeholder="描述"
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
          prop="admin_rule_id"
          label="ID"
          width="80"
          sortable="custom"
        />
        <el-table-column prop="rule_name" label="权限" min-width="120" />
        <el-table-column prop="rule_desc" label="描述" min-width="120" />
        <el-table-column
          prop="rule_sort"
          label="排序"
          width="80"
          sortable="custom"
        />
        <el-table-column
          prop="insert_time"
          label="添加时间"
          width="160"
          sortable="custom"
        />
        <el-table-column
          prop="update_time"
          label="修改时间"
          width="160"
          sortable="custom"
        />
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
          label="操作"
          width="150"
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

      <el-dialog
        :title="formData.admin_rule_id ? '修改' : '添加'"
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
          <el-form-item label="权限" prop="rule_name">
            <el-input v-model="formData.rule_name" clearable />
          </el-form-item>
          <el-form-item label="描述" prop="rule_desc">
            <el-input v-model="formData.rule_desc" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="rule_sort">
            <el-input v-model="formData.rule_sort" type="number" />
          </el-form-item>
          <el-form-item label="菜单">
            <el-tree
              ref="formMenuRef"
              :data="formMenu"
              :default-checked-keys="formData.admin_menu_ids"
              default-expand-all
              show-checkbox
              node-key="admin_menu_id"
              highlight-current
              :props="{
                children: 'children',
                label: 'menu_name'
              }"
              @check="formMenuCheck"
            />
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
  ruleList,
  ruleProhibit,
  ruleAdd,
  ruleEdit,
  ruleDele,
  menuList
} from '@/api/admin'
import Pagination from '@/components/Pagination'

export default {
  name: 'Rule',
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
      formMenu: [],
      formData: {
        admin_rule_id: '',
        admin_menu_ids: [],
        rule_name: '',
        rule_desc: '',
        rule_sort: '',
        is_prohibit: '0'
      },
      formRules: {
        rule_name: [{ required: true, message: '必填', trigger: 'blur' }]
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
      ruleList(this.tableQuery)
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
    tableProhibit(row) {
      this.loadingOpen()
      ruleProhibit(row)
        .then(res => {
          this.message(res.msg)
          this.tableList()
        })
        .catch(() => {
          this.loadingOpen()
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
      this.formMenuList()
      this.formReset()
    },
    tableEdit(row) {
      this.formVisible = true
      this.formMenuList()
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
          this.formData.admin_rule_id = row.admin_rule_id
          ruleDele(this.formData)
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
    formMenuList() {
      menuList().then(res => {
        this.formMenu = res.data.list
      })
    },
    formMenuCheck(data, node) {
      this.formData.admin_menu_ids = node.checkedKeys
    },
    formReset(row) {
      if (row) {
        this.formData.admin_rule_id = row.admin_rule_id
        this.formData.admin_menu_ids = row.admin_menu_ids
        this.formData.rule_name = row.rule_name
        this.formData.rule_desc = row.rule_desc
        this.formData.rule_sort = row.rule_sort
      } else {
        this.formData.admin_rule_id = ''
        this.formData.admin_menu_ids = []
        this.formData.rule_name = ''
        this.formData.rule_desc = ''
        this.formData.rule_sort = 200
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
          if (this.formData.admin_rule_id) {
            ruleEdit(this.formData)
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
            ruleAdd(this.formData)
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
