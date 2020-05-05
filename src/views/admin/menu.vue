<template>
  <div class="app-container">
    <div>
      <div class="filter-container">
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
        row-key="admin_menu_id"
        border
        style="width: 100%"
      >
        <el-table-column prop="menu_name" label="菜单名称" min-width="180" />
        <el-table-column prop="menu_url" label="菜单链接" min-width="180" />
        <el-table-column prop="menu_sort" label="菜单排序" width="80" />
        <el-table-column prop="admin_menu_id" label="ID" width="80" />
        <el-table-column prop="menu_pid" label="PID" width="80" />
        <el-table-column prop="insert_time" label="添加时间" width="160" />
        <el-table-column prop="update_time" label="修改时间" width="160" />
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
          prop="is_unauth"
          label="无需权限"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_unauth"
              active-value="1"
              inactive-value="0"
              @change="tableUnauth(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          fixed="right"
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

      <el-dialog
        :title="formData.admin_menu_id ? '修改' : '添加'"
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
          <el-form-item label="菜单父级" prop="menu_pid">
            <el-cascader
              v-model="formData.menu_pid"
              placeholder="一级菜单"
              :options="tableData"
              :props="{
                checkStrictly: true,
                value: 'admin_menu_id',
                label: 'menu_name'
              }"
              style="width:100%"
              clearable
              filterable
              @change="formMenuChange"
            />
          </el-form-item>
          <el-form-item label="菜单名称" prop="menu_name">
            <el-input v-model="formData.menu_name" clearable />
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
    </div>
  </div>
</template>

<script>
import {
  menuList,
  menuProhibit,
  menuUnauth,
  menuAdd,
  menuEdit,
  menuDele
} from '@/api/admin'

export default {
  name: 'Menu',
  data() {
    return {
      loading: false,
      loadingTime: 250,
      tableData: [],
      tableCount: 0,
      tableQuery: {},
      formVisible: false,
      formData: {
        admin_menu_id: '',
        menu_pid: 0,
        menu_name: '',
        menu_url: '',
        menu_sort: 200
      },
      formRules: {
        menu_name: [{ required: true, message: '必填', trigger: 'blur' }]
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
          this.formData.admin_menu_id = row.admin_menu_id
          menuDele(this.formData)
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
    }
  }
}
</script>
