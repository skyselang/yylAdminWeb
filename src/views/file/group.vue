<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="20">
          <el-input v-model="query.group_name" class="filter-item" style="width: 200px;" placeholder="名称" clearable />
          <el-input v-model="query.group_desc" class="filter-item" style="width: 200px;" placeholder="描述" clearable />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="4" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="datas" :height="height-50" style="width: 100%" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="group_id" label="分组ID" min-width="100" sortable="custom" />
      <el-table-column prop="group_name" label="名称" min-width="120" />
      <el-table-column prop="group_desc" label="描述" min-width="130" />
      <el-table-column prop="group_sort" label="排序" min-width="100" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" sortable="custom" />
      <el-table-column prop="is_disable" label="是否禁用" min-width="110" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.is_disable" v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row],0)" />
          <el-switch v-else v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row],1)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="85" align="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button size="mini" type="text" @click="disable(selection,0)">启用</el-button>
      <el-button size="mini" type="text" @click="disable(selection,1)">禁用</el-button>
      <el-button size="mini" type="text" @click="dele(selection)">删除</el-button>
    </div>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" :before-close="cancel">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body">
        <el-form-item label="名称" prop="group_name">
          <el-input v-model="model.group_name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="group_desc">
          <el-input v-model="model.group_desc" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="group_sort">
          <el-input v-model="model.group_sort" type="number" />
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-select v-model="model.is_disable" class="filter-item" placeholder="">
            <el-option :value="0" label="否" />
            <el-option :value="1" label="是" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="model.group_id" label="添加时间" prop="">
          <el-col :span="10">
            <el-input v-model="model.create_time" clearable placeholder="" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">修改时间</el-col>
          <el-col :span="10">
            <el-input v-model="model.update_time" clearable placeholder="" disabled />
          </el-col>
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
import { list, info, add, edit, dele, disable } from '@/api/file/group'

export default {
  name: 'FileGroup',
  components: { Pagination },
  data() {
    return {
      name: '文件分组',
      height: 680,
      loading: false,
      datas: [],
      count: 0,
      query: {
        page: 1,
        limit: 12
      },
      dialog: false,
      dialogTitle: '',
      model: {
        group_id: '',
        group_name: '',
        group_desc: '',
        group_sort: 50,
        is_disable: 0
      },
      selection: [],
      rules: {
        group_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
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
        this.datas = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
      this.query.sort_value = ''
      if (sort.order === 'ascending') {
        this.query.sort_value = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_value = 'desc'
        this.list()
      }
    },
    // 添加修改
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.group_id
      info({
        group_id: row.group_id
      }).then(res => {
        this.reset(res.data)
      })
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.group_id) {
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
    // 删除
    dele(row) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].group_id
          message = '确定要删除' + this.name + ' <span style="color:red">' + row[0].group_name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            group: row
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
    },
    // 禁用启用
    disable(row, is_disable = 0) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        this.loading = true
        disable({
          group: row,
          is_disable: is_disable
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 选择
    select(selection) {
      this.selection = selection
    },
    selectAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { confirmButtonText: '确定', callback: action => {} })
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
    }
  }
}
</script>

<style scoped>
</style>
