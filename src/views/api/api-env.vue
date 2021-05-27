<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="22">
          <el-input v-model="query.env_name" class="filter-item" style="width: 200px;" placeholder="名称" clearable />
          <el-input v-model="query.env_host" class="filter-item" style="width: 300px;" placeholder="Host" clearable />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="2" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="data" :height="height" style="width: 100%" border @sort-change="sort">
      <el-table-column prop="api_env_id" label="环境ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="env_name" label="名称" min-width="150" />
      <el-table-column prop="env_host" label="Host" min-width="300" show-overflow-tooltip>
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
      <el-table-column prop="env_header" label="Header" min-width="250" show-overflow-tooltip>
        <template slot="header">
          <span>Header </span>
          <el-tooltip placement="top" content="请求头部自定义字段，如token">
            <i class="el-icon-info" title="" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="env_remark" label="备注" min-width="180" show-overflow-tooltip />
      <el-table-column prop="env_sort" label="排序" min-width="80" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="145" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="success" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="dele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" width="50%" :before-close="cancel">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="名称" prop="env_name">
          <el-input v-model="model.env_name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="Host" prop="env_host">
          <el-input v-model="model.env_host" placeholder="请输入Host" clearable />
        </el-form-item>
        <el-form-item label="Header" prop="env_header">
          <el-input v-model="model.env_header" type="textarea" placeholder="请求头部自定义字段" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="env_remark">
          <el-input v-model="model.env_remark" placeholder="备注" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="env_sort">
          <el-input v-model="model.env_sort" type="number" placeholder="200" />
        </el-form-item>
        <el-form-item v-if="model.api_env_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" placeholder="" disabled />
        </el-form-item>
        <el-form-item v-if="model.api_env_id" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" placeholder="" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { list, info, add, edit, dele } from '@/api/api-env'

export default {
  name: 'ApiEnv',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      dialog: false,
      dialogTitle: '',
      data: [],
      count: 0,
      query: {
        page: 1,
        limit: 12
      },
      model: {
        api_env_id: '',
        env_name: '',
        env_host: '',
        env_header: '',
        env_remark: '',
        env_sort: 200
      },
      rules: {
        env_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        env_host: [{ required: true, message: '请输入Host', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加
    add() {
      this.dialog = true
      this.dialogTitle = '接口环境添加'
      this.reset()
    },
    // 修改
    edit(row) {
      this.dialog = true
      this.dialogTitle = '接口环境修改：' + row.api_env_id
      info({
        api_env_id: row.api_env_id
      }).then(res => {
        this.reset(res.data)
      })
    },
    // 删除
    dele(row) {
      this.$confirm(
        '确定要删除接口环境 <span style="color:red">' + row.env_name + ' </span>吗？',
        '删除接口环境：' + row.api_env_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.loading = true
        dele({
          api_env_id: row.api_env_id
        }).then(res => {
          this.reset()
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 取消
    cancel() {
      this.dialog = false
      this.reset()
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.api_env_id) {
            edit(this.model).then(res => {
              this.list()
              this.reset()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.list()
              this.reset()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
      }
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.list()
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.prop
      this.query.sort_type = ''
      if (sort.order === 'ascending') {
        this.query.sort_type = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_type = 'desc'
        this.list()
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
