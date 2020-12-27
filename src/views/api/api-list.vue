<template>
  <div class="app-container">
    <!-- 接口添加 -->
    <div class="filter-container" style="text-align:right">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="24" style="text-align:right;">
          <el-button class="filter-item" @click="apiRefresh()">刷新</el-button>
          <el-button class="filter-item" type="primary" @click="apiAddition()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 接口列表 -->
    <el-table v-loading="loading" :data="apiData" :height="height+80" style="width: 100%" row-key="api_id" border>
      <el-table-column prop="api_name" label="接口名称" min-width="180" fixed="left" />
      <el-table-column prop="api_url" label="接口链接" min-width="260" />
      <el-table-column prop="api_sort" label="接口排序" min-width="90" />
      <el-table-column prop="api_id" label="接口ID" min-width="90" />
      <el-table-column prop="api_pid" label="接口PID" min-width="90" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" />
      <el-table-column prop="is_disable" label="是否禁用" min-width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="apiIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unauth" label="无需权限" min-width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_unauth" :active-value="1" :inactive-value="0" @change="apiIsUnauth(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="220" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="apiAddition(row)">添加</el-button>
          <el-button size="mini" type="success" @click="apiModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="apiDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 接口添加、修改 -->
    <el-dialog :title="apiDialogTitle" :visible.sync="apiDialog" top="1vh" :before-close="apiCancel">
      <el-form ref="apiRef" :rules="apiRules" :model="apiModel" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item label="接口父级" prop="api_pid">
          <el-cascader v-model="apiModel.api_pid" :options="apiData" :props="apiProps" style="width:100%" clearable filterable placeholder="一级接口" @change="apiPidChange" />
        </el-form-item>
        <el-form-item label="接口名称" prop="api_name">
          <el-input v-model="apiModel.api_name" clearable placeholder="请输入接口名称" />
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="apiModel.api_url" clearable />
        </el-form-item>
        <el-form-item label="接口排序" prop="api_sort">
          <el-input v-model="apiModel.api_sort" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="apiCancel">取消</el-button>
        <el-button type="primary" @click="apiSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import {
  apiList,
  apiAdd,
  apiEdit,
  apiDele,
  apiDisable,
  apiUnauth
} from '@/api/api'

export default {
  name: 'ApiList',
  components: { },
  data() {
    return {
      height: 680,
      loading: false,
      apiData: [],
      apiDialog: false,
      apiDialogTitle: '',
      apiProps: {
        checkStrictly: true,
        value: 'api_id',
        label: 'api_name'
      },
      apiModel: {
        api_id: '',
        api_pid: 0,
        api_name: '',
        api_url: '',
        api_sort: 200
      },
      apiRules: {
        api_name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.apiList()
  },
  methods: {
    // 接口列表
    apiList() {
      this.loading = true
      apiList().then(res => {
        this.apiData = res.data.list
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 接口刷新
    apiRefresh() {
      this.apiList()
    },
    // 接口是否禁用
    apiIsProhibit(row) {
      this.loading = true
      apiDisable({
        api_id: row.api_id,
        is_disable: row.is_disable
      }).then(res => {
        this.apiList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 接口是否无需权限
    apiIsUnauth(row) {
      this.loading = true
      apiUnauth({
        api_id: row.api_id,
        is_unauth: row.is_unauth
      }).then(res => {
        this.apiList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 接口添加打开
    apiAddition(row) {
      this.apiDialog = true
      this.apiDialogTitle = '接口添加'
      this.apiModel = this.$options.data().apiModel
      if (row) {
        this.apiModel.api_pid = row.api_id
      }
    },
    // 接口修改打开
    apiModify(row) {
      this.apiDialog = true
      this.apiDialogTitle = '接口修改：' + row.api_name
      apiEdit({
        api_id: row.api_id
      }).then(res => {
        this.apiModel = res.data.api_info
      })
    },
    // 接口删除
    apiDelete(row) {
      this.$confirm(
        '确定要删除接口 <span style="color:red">' + row.api_name + ' </span>吗？',
        '删除：' + row.api_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        apiDele({
          api_id: row.api_id
        }).then(res => {
          this.apiReset()
          this.apiList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 接口父级选择
    apiPidChange(value) {
      if (value) {
        this.apiModel.api_pid = value[value.length - 1]
      }
    },
    // 接口添加、修改重置
    apiReset(row) {
      if (row) {
        this.apiModel = row
      } else {
        this.apiModel = this.$options.data().apiModel
      }
      if (this.$refs['apiRef'] !== undefined) {
        this.$refs['apiRef'].resetFields()
      }
    },
    // 接口添加、修改取消
    apiCancel() {
      this.apiReset()
      this.apiDialog = false
    },
    // 接口添加、修改提交
    apiSubmit() {
      this.$refs['apiRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.apiModel.api_id) {
            apiEdit(this.apiModel, 'post').then(res => {
              this.apiList()
              this.apiReset()
              this.apiDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            apiAdd(this.apiModel).then(res => {
              this.apiList()
              this.apiReset()
              this.apiDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    }
  }
}
</script>
