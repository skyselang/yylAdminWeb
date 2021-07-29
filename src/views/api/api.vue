<template>
  <div class="app-container">
    <!-- 添加 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="24" style="text-align:right;">
          <el-checkbox v-model="isExpandAll" class="filter-item" border @change="expandAll">收起</el-checkbox>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
          <el-button class="filter-item" type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height+50" style="width: 100%" row-key="api_id">
      <el-table-column prop="api_name" label="接口名称" min-width="210" />
      <el-table-column prop="api_url" label="接口链接" min-width="300" />
      <el-table-column prop="is_disable" label="是否禁用" min-width="95" align="center">
        <template slot="header">
          <span>是否禁用 </span>
          <el-tooltip placement="top">
            <div slot="content">开启后无法访问</div>
            <i class="el-icon-info" title="" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unlogin" label="无需登录" min-width="95" align="center">
        <template slot="header">
          <span>无需登录 </span>
          <el-tooltip placement="top">
            <div slot="content">开启后不用登录也可以访问，如登录注册等</div>
            <i class="el-icon-info" title="" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_unlogin" :active-value="1" :inactive-value="0" @change="unlogin(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="api_id" label="接口ID" min-width="80" />
      <el-table-column prop="api_sort" label="排序" min-width="80" />
      <el-table-column label="操作" min-width="130" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="add(row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" width="50%" top="1vh" :before-close="cancel">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="接口父级" prop="api_pid">
          <el-cascader
            v-model="model.api_pid"
            :options="data"
            :props="props"
            style="width:100%"
            clearable
            filterable
            placeholder="一级接口"
            @change="pidChange"
          />
        </el-form-item>
        <el-form-item label="接口名称" prop="api_name">
          <el-input v-model="model.api_name" placeholder="请输入接口名称" clearable />
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="model.api_url" placeholder="应用/控制器/操作，区分大小写" />
        </el-form-item>
        <el-form-item label="接口排序" prop="api_sort">
          <el-input v-model="model.api_sort" type="number" placeholder="200" />
        </el-form-item>
        <el-form-item v-if="model.api_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.api_id" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
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
import permission from '@/directive/permission/index.js' // 权限判断指令
import { list, info, add, edit, dele, disable, unlogin } from '@/api/api'

export default {
  name: 'Api',
  components: { },
  directives: { permission },
  data() {
    return {
      height: 680,
      loading: false,
      data: [],
      dialog: false,
      dialogTitle: '',
      props: {
        checkStrictly: true,
        value: 'api_id',
        label: 'api_name'
      },
      model: {
        api_id: '',
        api_pid: 0,
        api_name: '',
        api_method: 'GET',
        api_url: '',
        api_sort: 200
      },
      isExpandAll: true,
      rules: {
        api_name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }]
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
      list().then(res => {
        this.data = res.data.list
        this.isExpandAll = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 收起
    expandAll(e) {
      this.expandFor(this.data, !e)
    },
    expandFor(data, isExpand) {
      data.forEach(i => {
        this.$refs.table.toggleRowExpansion(i, isExpand)
        if (i.children) {
          this.expandFor(i.children, isExpand)
        }
      })
    },
    // 添加
    add(row) {
      this.dialog = true
      this.dialogTitle = '接口添加'
      this.model = this.$options.data().model
      if (row) {
        this.model.api_pid = row.api_id
      }
    },
    // 修改
    edit(row) {
      this.dialog = true
      this.loading = true
      this.dialogTitle = '接口修改：' + row.api_id
      info({
        api_id: row.api_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    dele(row) {
      this.$confirm(
        '确定要删除接口 <span style="color:red">' + row.api_name + ' </span>吗？',
        '删除接口：' + row.api_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.loading = true
        dele({
          api_id: row.api_id
        }).then(res => {
          this.reset()
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 刷新
    refresh() {
      this.list()
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
          if (this.model.api_id) {
            edit(this.model, 'post').then(res => {
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
    // 是否禁用
    disable(row) {
      this.loading = true
      disable({
        api_id: row.api_id,
        is_disable: row.is_disable
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
        this.loading = false
      })
    },
    // 是否无需登录
    unlogin(row) {
      this.loading = true
      unlogin({
        api_id: row.api_id,
        is_unlogin: row.is_unlogin
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
        this.loading = false
      })
    },
    // 父级选择
    pidChange(value) {
      if (value) {
        this.model.api_pid = value[value.length - 1]
      }
    }
  }
}
</script>
