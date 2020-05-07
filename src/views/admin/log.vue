<template>
  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input
          v-model="tableQuery.admin_user_id"
          placeholder="用户ID"
          style="width: 200px;"
          class="filter-item"
          clearable
        />
        <el-input
          v-model="tableQuery.menu_url"
          placeholder="菜单链接"
          style="width: 200px;"
          class="filter-item"
          clearable
        />
        <el-date-picker
          v-model="tableQuery.insert_time"
          type="daterange"
          style="width: 240px;top: -4px;"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
        <el-button class="filter-item" type="primary" @click="tableSearch">
          查询
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
          prop="admin_log_id"
          label="ID"
          width="100"
          sortable="custom"
        />
        <el-table-column
          prop="admin_user_id"
          label="用户ID"
          min-width="90"
          sortable="custom"
        />
        <el-table-column prop="username" label="用户账号" min-width="100" />
        <el-table-column prop="nickname" label="用户昵称" min-width="100" />
        <el-table-column prop="menu_url" label="菜单链接" min-width="220" />
        <el-table-column prop="menu_name" label="菜单名称" min-width="120" />
        <el-table-column
          prop="request_method"
          label="请求方式 "
          min-width="120"
          sortable="custom"
        />
        <el-table-column
          prop="request_ip"
          label="请求IP"
          min-width="130"
          sortable="custom"
        />
        <el-table-column
          prop="insert_time"
          label="请求时间"
          width="160"
          sortable="custom"
        />
        <el-table-column
          label="操作"
          width="150"
          align="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="tableInfo(row)">
              信息
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
        :title="'日志ID：' + formData.admin_log_id"
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
          <el-form-item label="用户ID" prop="admin_user_id">
            <el-input v-model="formData.admin_user_id" />
          </el-form-item>
          <el-form-item label="用户账号" prop="username">
            <el-input v-model="formData.username" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="formData.nickname" />
          </el-form-item>
          <el-form-item label="菜单链接" prop="menu_url">
            <el-input v-model="formData.menu_url" />
          </el-form-item>
          <el-form-item label="菜单名称" prop="menu_name">
            <el-input v-model="formData.menu_name" />
          </el-form-item>
          <el-form-item label="请求方式" prop="request_method">
            <el-input v-model="formData.request_method" />
          </el-form-item>
          <el-form-item label="请求IP" prop="request_ip">
            <el-input v-model="formData.request_ip" />
          </el-form-item>
          <el-form-item label="请求时间" prop="insert_time">
            <el-input v-model="formData.insert_time" />
          </el-form-item>
          <el-form-item label="请求参数" prop="request_param">
            <pre>{{ formData.request_param }}</pre>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="formCancel">
            取消
          </el-button>
          <el-button type="primary" @click="formSubmit">
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { logList, logInfo, logDele } from '@/api/admin'
import Pagination from '@/components/Pagination'

export default {
  name: 'Log',
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
      formData: {},
      formRules: {}
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
      logList(this.tableQuery)
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
    tableSearch() {
      this.tableQuery.page = 1
      this.tableList()
    },
    tableReset() {
      this.tableQuery = { page: 1, limit: 10 }
      this.tableList()
    },
    tableInfo(row) {
      this.loadingOpen()
      logInfo({ admin_log_id: row.admin_log_id })
        .then(res => {
          this.formVisible = true
          this.formReset(res.data)
          this.loadingClose()
        })
        .catch(() => {
          this.loadingClose()
        })
    },
    tableDele(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadingOpen()
          logDele({ admin_log_id: row.admin_log_id })
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
    formReset(row) {
      if (row) {
        this.formData.admin_log_id = row.admin_log_id
        this.formData.admin_user_id = row.admin_user_id
        this.formData.username = row.username
        this.formData.nickname = row.nickname
        this.formData.menu_url = row.menu_url
        this.formData.menu_name = row.menu_name
        this.formData.request_method = row.request_method
        this.formData.request_ip = row.request_ip
        this.formData.request_param = row.request_param
        this.formData.insert_time = row.insert_time
      } else {
        this.formData.admin_log_id = ''
        this.formData.admin_user_id = ''
        this.formData.username = ''
        this.formData.nickname = ''
        this.formData.menu_url = ''
        this.formData.menu_name = ''
        this.formData.request_method = ''
        this.formData.request_ip = ''
        this.formData.request_param = ''
        this.formData.insert_time = ''
      }
    },
    formCancel() {
      this.formVisible = false
      this.formReset()
    },
    formSubmit() {
      this.formVisible = false
      this.formReset()
    }
  }
}
</script>
