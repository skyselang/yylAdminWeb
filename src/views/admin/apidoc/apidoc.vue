<template>
  <div class="app-container">
    <!-- 接口添加、刷新 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="float:right;margin-left:10px" @click="apidocAddition()">添加</el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="apidocRefresh">刷新</el-button>
    </div>
    <!-- 接口列表 -->
    <el-table v-loading="loading" :data="apidocData" :height="height+100" style="width: 100%" row-key="admin_apidoc_id" border>
      <el-table-column prop="apidoc_name" label="接口名称" min-width="180" fixed="left" />
      <el-table-column prop="apidoc_method" label="请求方式" min-width="100" />
      <el-table-column prop="apidoc_path" label="接口路径" min-width="250" />
      <el-table-column prop="apidoc_sort" label="接口排序" min-width="100" />
      <el-table-column prop="admin_apidoc_id" label="ID" min-width="100" />
      <el-table-column prop="apidoc_pid" label="PID" min-width="100" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" />
      <el-table-column label="操作" min-width="220" fixed="right" align="right" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="apidocAddition(row)">添加</el-button>
          <el-button size="mini" type="primary" @click="apidocModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="apidocDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 接口添加、修改、详情 -->
    <el-dialog :title="apidocModel.dialog_title" width="65%" :visible.sync="apidocDialog" top="1vh">
      <el-form ref="formRef" :rules="apidocRules" :model="apidocModel" class="dialog-body" label-width="100px" :style="{height:height+80+'px'}">
        <el-tabs v-model="apidocTabName" type="card">
          <el-tab-pane label="基本信息" name="baseinfo">
            <el-form-item label="接口父级" prop="apidoc_pid">
              <el-cascader v-model="apidocModel.apidoc_pid" :options="apidocData" :props="apidocProps" style="width:100%" clearable filterable placeholder="一级接口" @change="apidocPidChange" />
            </el-form-item>
            <el-form-item label="接口名称" prop="apidoc_name">
              <el-input v-model="apidocModel.apidoc_name" clearable placeholder="请输入接口名称" />
            </el-form-item>
            <el-form-item label="请求方式" prop="apidoc_method">
              <el-col :span="12">
                <el-select v-model="apidocModel.apidoc_method" placeholder="请选择">
                  <el-option key="1" label="GET" value="GET" />
                  <el-option key="2" label="POST" value="POST" />
                  <el-option key="3" label="PUT" value="PUT" />
                  <el-option key="4" label="DELETE" value="DELETE" />
                </el-select>
              </el-col>
              <el-col class="line" :span="2">排序</el-col>
              <el-col :span="10">
                <el-input v-model="apidocModel.apidoc_sort" type="number" />
              </el-col>
            </el-form-item>
            <el-form-item label="接口路径" prop="apidoc_path">
              <el-input v-model="apidocModel.apidoc_path" clearable />
            </el-form-item>
            <el-form-item label="请求参数" prop="apidoc_request">
              <el-input v-model="apidocModel.apidoc_request" type="textarea" autosize clearable />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="返回参数" name="response">
            <el-form-item label="返回参数" prop="apidoc_response">
              <el-input v-model="apidocModel.apidoc_response" type="textarea" autosize clearable />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="返回示例" name="example">
            <el-form-item label="返回示例" prop="apidoc_example">
              <el-input v-model="apidocModel.apidoc_example" type="textarea" autosize clearable />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="额外说明" name="explain">
            <el-form-item label="额外说明" prop="apidoc_explain">
              <el-input v-model="apidocModel.apidoc_explain" type="textarea" autosize clearable />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="apidocCancel">取消</el-button>
        <el-button type="primary" @click="apidocSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import {
  apidocList,
  apidocInfo,
  apidocAdd,
  apidocEdit,
  apidocDele
} from '@/api/admin'

export default {
  name: 'Apidoc',
  data() {
    return {
      height: 680,
      loading: false,
      loadingTime: 0,
      apidocData: [],
      apidocCount: 0,
      apidocQuery: {},
      apidocDialog: false,
      apidocProps: {
        checkStrictly: true,
        value: 'admin_apidoc_id',
        label: 'apidoc_name'
      },
      apidocTabName: 'baseinfo',
      apidocModel: {
        dialog_title: '',
        admin_apidoc_id: '',
        apidoc_pid: 0,
        apidoc_name: '',
        apidoc_path: '',
        apidoc_method: 'GET',
        apidoc_request: '',
        apidoc_response: '',
        apidoc_example: '',
        apidoc_explain: '',
        apidoc_sort: 200
      },
      apidocRules: {
        apidoc_name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.apidocList()
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
    // 接口列表
    apidocList() {
      this.loadOpen()
      apidocList(this.apidocQuery)
        .then(res => {
          this.apidocData = res.data.list
          this.apidocCount = res.data.count
          this.loadClose()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    // 接口刷新
    apidocRefresh() {
      this.apidocList()
    },
    // 接口详情
    apidocInfo(admin_apidoc_id) {
      this.loading = true
      apidocInfo({ admin_apidoc_id: admin_apidoc_id })
        .then(res => {
          this.loading = false
          this.apidocReset(res.data)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 接口添加
    apidocAddition(row) {
      this.apidocDialog = true
      if (row) {
        this.apidocModel.dialog_title = '接口添加'
        this.apidocModel.admin_apidoc_id = ''
        this.apidocModel.apidoc_pid = row.admin_apidoc_id
        this.apidocModel.apidoc_name = ''
        this.apidocModel.apidoc_path = ''
        this.apidocModel.apidoc_method = ''
        this.apidocModel.apidoc_request = ''
        this.apidocModel.apidoc_response = ''
        this.apidocModel.apidoc_example = ''
        this.apidocModel.apidoc_explain = ''
        this.apidocModel.apidoc_sort = 200
      } else {
        this.apidocReset()
      }
    },
    // 接口修改、详情
    apidocModify(row) {
      this.apidocDialog = true
      this.apidocInfo(row.admin_apidoc_id)
    },
    // 接口删除
    apidocDelete(row) {
      this.$confirm('确定删除吗（它所有子接口也将删除）？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadOpen()
          apidocDele({ admin_apidoc_id: row.admin_apidoc_id })
            .then(res => {
              this.$message(res.msg)
              this.apidocReset()
              this.apidocList()
            })
            .catch(() => {
              this.loadClose()
            })
        })
        .catch(() => {})
    },
    // 接口父级选择
    apidocPidChange(value) {
      if (value) {
        this.apidocModel.apidoc_pid = value[value.length - 1]
      }
    },
    // 接口添加、修改数据重置
    apidocReset(row) {
      if (row) {
        this.apidocModel.dialog_title = '接口修改：' + row.apidoc_name
        this.apidocModel.admin_apidoc_id = row.admin_apidoc_id
        this.apidocModel.apidoc_pid = row.apidoc_pid
        this.apidocModel.apidoc_name = row.apidoc_name
        this.apidocModel.apidoc_path = row.apidoc_path
        this.apidocModel.apidoc_method = row.apidoc_method
        this.apidocModel.apidoc_request = row.apidoc_request
        this.apidocModel.apidoc_response = row.apidoc_response
        this.apidocModel.apidoc_example = row.apidoc_example
        this.apidocModel.apidoc_explain = row.apidoc_explain
        this.apidocModel.apidoc_sort = row.apidoc_sort
      } else {
        this.apidocModel.dialog_title = '接口添加'
        this.apidocModel.admin_apidoc_id = ''
        this.apidocModel.apidoc_pid = 0
        this.apidocModel.apidoc_name = ''
        this.apidocModel.apidoc_path = ''
        this.apidocModel.apidoc_method = 'GET'
        this.apidocModel.apidoc_request = ''
        this.apidocModel.apidoc_response = ''
        this.apidocModel.apidoc_example = ''
        this.apidocModel.apidoc_explain = ''
        this.apidocModel.apidoc_sort = 200
      }
    },
    // 接口添加、修改取消
    apidocCancel() {
      this.apidocDialog = false
      this.apidocReset()
    },
    // 接口添加、修改提交
    apidocSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          if (this.apidocModel.admin_apidoc_id) {
            apidocEdit(this.apidocModel)
              .then(res => {
                this.apidocDialog = false
                this.message(res.msg)
                this.apidocReset()
                this.apidocList()
              })
              .catch(() => {
                this.loadClose()
              })
          } else {
            apidocAdd(this.apidocModel)
              .then(res => {
                this.apidocDialog = false
                this.message(res.msg)
                this.apidocReset()
                this.apidocList()
              })
              .catch(() => {
                this.loadClose()
              })
          }
        }
      })
    }
  }
}
</script>
