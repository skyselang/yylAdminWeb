<template>
  <div class="app-container">
    <!-- 文档添加、刷新 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" style="float:right;margin-left:10px" @click="devdocAddition()">添加</el-button>
      <el-button class="filter-item" type="primary" style="float:right;" @click="devdocRefresh">刷新</el-button>
    </div>
    <!-- 文档列表 -->
    <el-table v-loading="loading" :data="devdocData" :height="height+100" style="width: 100%" row-key="admin_devdoc_id" border>
      <el-table-column prop="devdoc_name" label="名称" min-width="180" fixed="left" />
      <el-table-column prop="devdoc_sort" label="排序" min-width="100" />
      <el-table-column prop="admin_devdoc_id" label="ID" min-width="100" />
      <el-table-column prop="devdoc_pid" label="PID" min-width="100" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" />
      <el-table-column label="操作" min-width="220" fixed="right" align="right" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="devdocAddition(row)">添加</el-button>
          <el-button size="mini" type="primary" @click="devdocModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="devdocDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 文档添加、修改、详情 -->
    <el-dialog :title="devdocModel.dialog_title" width="65%" :visible.sync="devdocDialog" top="1vh">
      <el-form ref="formRef" :rules="devdocRules" :model="devdocModel" class="dialog-body" label-width="100px" :style="{height:height+80+'px'}">
        <el-form-item label="父级" prop="devdoc_pid">
          <el-cascader v-model="devdocModel.devdoc_pid" :options="devdocData" :props="devdocProps" style="width:100%" clearable filterable placeholder="一级文档" @change="devdocPidChange" />
        </el-form-item>
        <el-form-item label="名称" prop="devdoc_method">
          <el-col :span="14">
            <el-input v-model="devdocModel.devdoc_name" clearable placeholder="请输入名称" />
          </el-col>
          <el-col class="line" :span="2">排序</el-col>
          <el-col :span="8">
            <el-input v-model="devdocModel.devdoc_sort" type="number" />
          </el-col>
        </el-form-item>
        <el-form-item label="内容" prop="devdoc_content">
          <el-input v-model="devdocModel.devdoc_content" type="textarea" autosize clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="devdocCancel">取消</el-button>
        <el-button type="primary" @click="devdocSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import {
  devdocList,
  devdocInfo,
  devdocAdd,
  devdocEdit,
  devdocDele
} from '@/api/admin'

export default {
  name: 'Devdoc',
  data() {
    return {
      height: 680,
      loading: false,
      loadingTime: 0,
      devdocData: [],
      devdocCount: 0,
      devdocQuery: {},
      devdocDialog: false,
      devdocProps: {
        checkStrictly: true,
        value: 'admin_devdoc_id',
        label: 'devdoc_name'
      },
      devdocTabName: 'baseinfo',
      devdocModel: {
        dialog_title: '',
        admin_devdoc_id: '',
        devdoc_pid: 0,
        devdoc_name: '',
        devdoc_content: '',
        devdoc_sort: 200
      },
      devdocRules: {
        devdoc_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.devdocList()
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
    // 文档列表
    devdocList() {
      this.loadOpen()
      devdocList(this.devdocQuery)
        .then(res => {
          this.devdocData = res.data.list
          this.devdocCount = res.data.count
          this.loadClose()
        })
        .catch(() => {
          this.loadClose()
        })
    },
    // 文档刷新
    devdocRefresh() {
      this.devdocList()
    },
    // 文档详情
    devdocInfo(admin_devdoc_id) {
      this.loading = true
      devdocInfo({ admin_devdoc_id: admin_devdoc_id })
        .then(res => {
          this.loading = false
          this.devdocReset(res.data)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 文档添加
    devdocAddition(row) {
      this.devdocDialog = true
      if (row) {
        this.devdocModel.dialog_title = '文档添加'
        this.devdocModel.admin_devdoc_id = ''
        this.devdocModel.devdoc_pid = row.admin_devdoc_id
        this.devdocModel.devdoc_name = ''
        this.devdocModel.devdoc_content = ''
        this.devdocModel.devdoc_sort = 200
      } else {
        this.devdocReset()
      }
    },
    // 文档修改、详情
    devdocModify(row) {
      this.devdocDialog = true
      this.devdocInfo(row.admin_devdoc_id)
    },
    // 文档删除
    devdocDelete(row) {
      this.$confirm('确定删除吗（它所有子文档也将删除）？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadOpen()
          devdocDele({ admin_devdoc_id: row.admin_devdoc_id })
            .then(res => {
              this.$message(res.msg)
              this.devdocReset()
              this.devdocList()
            })
            .catch(() => {
              this.loadClose()
            })
        })
        .catch(() => {})
    },
    // 文档父级选择
    devdocPidChange(value) {
      if (value) {
        this.devdocModel.devdoc_pid = value[value.length - 1]
      }
    },
    // 文档添加、修改数据重置
    devdocReset(row) {
      if (row) {
        this.devdocModel.dialog_title = '文档修改：' + row.devdoc_name
        this.devdocModel.admin_devdoc_id = row.admin_devdoc_id
        this.devdocModel.devdoc_pid = row.devdoc_pid
        this.devdocModel.devdoc_name = row.devdoc_name
        this.devdocModel.devdoc_content = row.devdoc_content
        this.devdocModel.devdoc_sort = row.devdoc_sort
      } else {
        this.devdocModel.dialog_title = '文档添加'
        this.devdocModel.admin_devdoc_id = ''
        this.devdocModel.devdoc_pid = 0
        this.devdocModel.devdoc_name = ''
        this.devdocModel.devdoc_content = ''
        this.devdocModel.devdoc_sort = 200
      }
    },
    // 文档添加、修改取消
    devdocCancel() {
      this.devdocDialog = false
      this.devdocReset()
    },
    // 文档添加、修改提交
    devdocSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.loadOpen()
          if (this.devdocModel.admin_devdoc_id) {
            devdocEdit(this.devdocModel)
              .then(res => {
                this.devdocDialog = false
                this.message(res.msg)
                this.devdocReset()
                this.devdocList()
              })
              .catch(() => {
                this.loadClose()
              })
          } else {
            devdocAdd(this.devdocModel)
              .then(res => {
                this.devdocDialog = false
                this.message(res.msg)
                this.devdocReset()
                this.devdocList()
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
