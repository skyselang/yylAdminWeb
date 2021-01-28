<template>
  <div class="app-container">
    <!-- 接口环境查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="22">
          <el-input v-model="apiEnvQuery.name" class="filter-item" style="width: 200px;" placeholder="名称" clearable />
          <el-input v-model="apiEnvQuery.host" class="filter-item" style="width: 300px;" placeholder="Host" clearable />
          <el-button class="filter-item" type="primary" @click="apiEnvSearch()">查询</el-button>
          <el-button class="filter-item" @click="apiEnvRefresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="2" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="apiEnvAddition()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 接口环境列表 -->
    <el-table ref="apiEnvTableRef" v-loading="loading" :data="apiEnvData" :height="height" style="width: 100%" border @sort-change="apiEnvSort">
      <el-table-column prop="api_env_id" label="ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="name" label="名称" min-width="180" />
      <el-table-column prop="host" label="Host" min-width="320" show-overflow-tooltip>
        <template slot="header">
          <span>Host </span>
          <el-tooltip placement="top">
            <div slot="content">
              Host与接口链接组成完整的接口URL，如：<br><br>
              Host：https://api.yyladmin.top<br><br>
              接口链接：index/Login/login<br><br>
              接口URL：https://api.yyladmin.top/index/Login/login
            </div>
            <i class="el-icon-info" title="" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="header" label="Header" min-width="250" show-overflow-tooltip>
        <template slot="header">
          <span>Header </span>
          <el-tooltip placement="top" content="请求头部自定义字段，如token">
            <i class="el-icon-info" title="" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      <el-table-column prop="sort" label="排序" min-width="100" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="160" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="success" @click="apiEnvModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="apiEnvDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 接口环境分页 -->
    <pagination v-show="apiEnvCount > 0" :total="apiEnvCount" :page.sync="apiEnvQuery.page" :limit.sync="apiEnvQuery.limit" @pagination="apiEnvList" />
    <!-- 接口环境添加、修改 -->
    <el-dialog :title="apiEnvDialogTitle" :visible.sync="apiEnvDialog" top="1vh" :before-close="apiEnvCancel">
      <el-form ref="apiEnvRef" :rules="apiEnvRules" :model="apiEnvModel" label-width="100px" class="dialog-body" :style="{height:height+30+'px'}">
        <el-form-item label="名称" prop="name">
          <el-input v-model="apiEnvModel.name" placeholder="请输入接口环境名称" clearable />
        </el-form-item>
        <el-form-item label="Host" prop="host">
          <el-input v-model="apiEnvModel.host" placeholder="请输入接口环境Host" clearable />
        </el-form-item>
        <el-form-item label="Header" prop="header">
          <el-input v-model="apiEnvModel.header" type="textarea" placeholder="请求头部自定义字段" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="apiEnvModel.remark" placeholder="接口环境备注" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="apiEnvModel.sort" type="number" placeholder="200" />
        </el-form-item>
        <el-form-item v-if="apiEnvModel.api_env_id" label="添加时间" prop="create_time">
          <el-input v-model="apiEnvModel.create_time" placeholder="" disabled />
        </el-form-item>
        <el-form-item v-if="apiEnvModel.api_env_id" label="修改时间" prop="update_time">
          <el-input v-model="apiEnvModel.update_time" placeholder="" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="apiEnvCancel">取消</el-button>
        <el-button type="primary" @click="apiEnvSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { apiEnvList, apiEnvAdd, apiEnvEdit, apiEnvDele } from '@/api/api-env'

export default {
  name: 'ApiEnv',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      apiEnvDialog: false,
      apiEnvDialogTitle: '',
      apiEnvData: [],
      apiEnvCount: 0,
      apiEnvQuery: {
        page: 1,
        limit: 13
      },
      apiEnvModel: {
        api_env_id: '',
        name: '',
        host: '',
        header: '',
        remark: '',
        sort: 200
      },
      apiEnvRules: {
        name: [{ required: true, message: '请输入接口环境名称', trigger: 'blur' }],
        host: [{ required: true, message: '请输入接口环境Host', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.apiEnvList()
  },
  methods: {
    // 接口环境列表
    apiEnvList() {
      this.loading = true
      apiEnvList(this.apiEnvQuery).then(res => {
        this.apiEnvData = res.data.list
        this.apiEnvCount = res.data.count
        this.loading = false
        this.$nextTick(() => {
          this.$refs['apiEnvTableRef'].doLayout()
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 接口环境查询
    apiEnvSearch() {
      this.apiEnvQuery.page = 1
      this.apiEnvList()
    },
    // 接口环境刷新
    apiEnvRefresh() {
      this.apiEnvQuery = this.$options.data().apiEnvQuery
      this.apiEnvList()
    },
    // 接口环境排序
    apiEnvSort(sort) {
      this.apiEnvQuery.sort_field = sort.prop
      this.apiEnvQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.apiEnvQuery.sort_type = 'asc'
        this.apiEnvList()
      }
      if (sort.order === 'descending') {
        this.apiEnvQuery.sort_type = 'desc'
        this.apiEnvList()
      }
    },
    // 接口环境添加打开
    apiEnvAddition() {
      this.apiEnvDialog = true
      this.apiEnvReset()
    },
    // 接口环境修改打开
    apiEnvModify(row) {
      this.apiEnvDialog = true
      apiEnvEdit({
        api_env_id: row.api_env_id
      }).then(res => {
        this.apiEnvReset(res.data)
      })
    },
    // 接口环境添加、修改重置
    apiEnvReset(row) {
      if (row) {
        this.apiEnvModel = row
        this.apiEnvDialogTitle = '接口环境修改：' + row.name
      } else {
        this.apiEnvModel = this.$options.data().apiEnvModel
        this.apiEnvDialogTitle = '接口环境添加'
      }
      if (this.$refs['apiEnvRef'] !== undefined) {
        this.$refs['apiEnvRef'].resetFields()
      }
    },
    // 接口环境添加、修改取消
    apiEnvCancel() {
      this.apiEnvDialog = false
      this.apiEnvReset()
    },
    // 接口环境添加、修改提交
    apiEnvSubmit() {
      this.$refs['apiEnvRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.apiEnvModel.api_env_id) {
            apiEnvEdit(this.apiEnvModel, 'post').then(res => {
              this.apiEnvList()
              this.apiEnvReset()
              this.apiEnvDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            apiEnvAdd(this.apiEnvModel).then(res => {
              this.apiEnvList()
              this.apiEnvReset()
              this.apiEnvDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 接口环境删除
    apiEnvDelete(row) {
      this.$confirm(
        '确定要删除接口环境 <span style="color:red">' + row.name + ' </span>吗？',
        '删除：' + row.api_env_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        apiEnvDele({
          api_env_id: row.api_env_id
        }).then(res => {
          this.apiEnvReset()
          this.apiEnvList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
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
