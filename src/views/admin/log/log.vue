<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input v-model="logQuery.admin_user_id" class="filter-item" style="width: 120px;" placeholder="用户ID" clearable />
      <el-input v-model="logQuery.menu_url" class="filter-item" style="width: 280px;" placeholder="菜单链接" clearable />
      <el-date-picker v-model="logQuery.create_time" type="daterange" style="width: 240px;top: -4px;" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
      <el-button class="filter-item" type="primary" @click="logSearch">
        查询
      </el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="logRefresh">
        刷新
      </el-button>
    </div>
    <!-- 日志 -->
    <el-table v-loading="loading" :data="logData" :height="height" style="width: 100%" border @sort-change="logSort" @cell-click="logCellClick">
      <el-table-column prop="admin_log_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="admin_user_id" label="用户ID" min-width="90" sortable="custom" />
      <el-table-column prop="username" label="用户账号" min-width="110" />
      <el-table-column prop="nickname" label="用户昵称" min-width="110" />
      <el-table-column prop="menu_url" label="菜单链接" min-width="220" />
      <el-table-column prop="menu_name" label="菜单名称" min-width="120" />
      <el-table-column prop="request_method" label="请求方式 " min-width="110" sortable="custom" />
      <el-table-column prop="request_ip" label="请求IP" min-width="130" sortable="custom" />
      <el-table-column prop="request_region" label="请求地区" min-width="150" />
      <el-table-column prop="request_isp" label="请求ISP" min-width="110" />
      <el-table-column prop="create_time" label="请求时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="150" align="right" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="logDetail(row)">
            详情
          </el-button>
          <el-button size="mini" type="danger" @click="logDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="logCount > 0" :total="logCount" :page.sync="logQuery.page" :limit.sync="logQuery.limit" @pagination="logLists" />
    <!-- IP信息 -->
    <el-dialog :title="ipTitle" :visible.sync="ipDialog" width="65%" top="1vh">
      <iframe :src="ipUrl" frameborder="0" width="100%" :height="height+100" />
    </el-dialog>
    <!-- 详情 -->
    <el-dialog :title="'日志信息：' + logModel.admin_log_id" :visible.sync="logDialog" width="65%" top="1vh">
      <el-form ref="formRef" :rules="logRules" :model="logModel" label-width="80px" class="dialog-body" :style="{height:height+100+'px'}">
        <el-form-item label="用户ID" prop="admin_user_id">
          <el-input v-model="logModel.admin_user_id" />
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="logModel.username" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="logModel.nickname" />
        </el-form-item>
        <el-form-item label="菜单链接" prop="menu_url">
          <el-input v-model="logModel.menu_url" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="logModel.menu_name" />
        </el-form-item>
        <el-form-item label="请求方式" prop="request_method">
          <el-input v-model="logModel.request_method" />
        </el-form-item>
        <el-form-item label="请求IP" prop="request_ip">
          <el-input v-model="logModel.request_ip" />
        </el-form-item>
        <el-form-item label="请求地区" prop="request_region">
          <el-input v-model="logModel.request_region" />
        </el-form-item>
        <el-form-item label="请求ISP" prop="request_isp">
          <el-input v-model="logModel.request_isp" />
        </el-form-item>
        <el-form-item label="请求时间" prop="create_time">
          <el-input v-model="logModel.create_time" />
        </el-form-item>
        <el-form-item label="请求参数" prop="request_param">
          <pre>{{ logModel.request_param }}</pre>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logCancel">
          取消
        </el-button>
        <el-button type="primary" @click="logSubmit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { logList, logInfo, logDele } from '@/api/admin'

export default {
  name: 'Log',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      loadingTime: 0,
      logData: [],
      logCount: 0,
      logQuery: {
        page: 1,
        limit: 10
      },
      ipNumber: 1,
      ipTitle: '',
      ipUrl: '',
      ipDialog: false,
      logDialog: false,
      logModel: {},
      logRules: {}
    }
  },
  created() {
    this.height = screenHeight()
    this.logLists()
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
    logLists() {
      this.loadOpen()
      logList(this.logQuery)
        .then(res => {
          this.logData = res.data.list
          this.logCount = res.data.count
          this.loadClose()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    logSort(sort) {
      this.logQuery.order_field = sort.prop
      this.logQuery.order_type = ''
      if (sort.order === 'ascending') {
        this.logQuery.order_type = 'asc'
        this.logLists()
      }
      if (sort.order === 'descending') {
        this.logQuery.order_type = 'desc'
        this.logLists()
      }
    },
    logSearch() {
      this.logQuery.page = 1
      this.logLists()
    },
    logRefresh() {
      this.logQuery = { page: 1, limit: 10 }
      this.logLists()
    },
    logDetail(row) {
      this.loadOpen()
      logInfo({ admin_log_id: row.admin_log_id })
        .then(res => {
          this.logDialog = true
          this.logReset(res.data)
          this.loadClose()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    logDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadOpen()
          logDele({ admin_log_id: row.admin_log_id })
            .then(res => {
              this.message(res.msg)
              this.logReset()
              this.logLists()
            })
            .catch(() => {
              this.loadClose()
            })
        })
        .catch(() => {})
    },
    logCellClick(row, column, cell, event) {
      if (column.property === 'request_ip') {
        this.ipNumber = parseInt(Math.random() * 4)
        if (this.ipNumber === 0) {
          this.ipUrl = 'https://www.ip.cn/?ip=' + row.request_ip
        } else if (this.ipNumber === 1) {
          this.ipUrl =
            'https://www.ip138.com/iplookup.asp?ip=' +
            row.request_ip +
            '&action=2'
        } else if (this.ipNumber === 2) {
          this.ipUrl = 'http://www.882667.com/ip_' + row.request_ip + '.html'
        } else if (this.ipNumber === 3) {
          this.ipUrl = 'https://www.ip38.com/ip.php?ip=' + row.request_ip
        } else {
          this.ipUrl = 'https://www.123cha.com/ip/?q=' + row.request_ip
        }
        this.ipTitle = row.request_ip
        this.ipDialog = true
      }
    },
    logReset(row) {
      if (row) {
        this.logModel = row
      } else {
        this.logModel = {}
      }
    },
    logCancel() {
      this.logDialog = false
      this.logReset()
    },
    logSubmit() {
      this.logDialog = false
      this.logReset()
    }
  }
}
</script>
