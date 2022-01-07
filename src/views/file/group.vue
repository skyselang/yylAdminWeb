<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="group_name" label="名称" />
            <el-option value="group_desc" label="描述" />
            <el-option value="is_disable" label="是否禁用" />
            <el-option :value="idkey" label="ID" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="filter-item ya-date-value"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button @click="selectOpen('disable')">禁用</el-button>
          <el-button @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :rows="2" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='disable'" label="禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='dele'" label="" prop="">
            <span style="color:red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectCancel">取消</el-button>
          <el-button type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" min-width="100" sortable="custom" />
      <el-table-column prop="group_name" label="名称" min-width="120" />
      <el-table-column prop="group_desc" label="描述" min-width="130" />
      <el-table-column prop="group_sort" label="排序" min-width="100" sortable="custom" />
      <el-table-column prop="is_disable" label="禁用" min-width="110" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="85" align="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
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
        <el-form-item label="禁用" prop="is_disable">
          <el-switch v-model="model.is_disable" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
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
import Pagination from '@/components/Pagination'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, disable } from '@/api/file/group'

export default {
  name: 'FileGroup',
  components: { Pagination },
  data() {
    return {
      name: '文件分组',
      height: 680,
      loading: false,
      idkey: 'group_id',
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      query: {
        page: 1,
        limit: 12,
        search_field: 'group_name',
        date_field: 'create_time'
      },
      model: {
        group_id: '',
        group_name: '',
        group_desc: '',
        group_sort: 250,
        is_disable: 0
      },
      rules: {
        group_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      is_disable: 0
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
    // 添加修改
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
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
          if (this.model[this.idkey]) {
            edit(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.list()
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
        this.$refs['ref'].clearValidate()
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
    // 选中操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds(selection).toString()
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => {} })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        this.$refs['table'].toggleRowSelection(selectRow)
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '选中操作'
        if (selectType === 'disable') {
          this.selectTitle = '是否禁用'
        } else if (selectType === 'dele') {
          this.selectTitle = '删除' + this.name
        }
        this.selectDialog = true
        this.selectType = selectType
      }
    },
    selectCancel() {
      this.selectDialog = false
    },
    selectSubmit() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        const selectType = this.selectType
        if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection, true)
        }
        this.selectDialog = false
      }
    },
    // 是否禁用
    disable(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_disable = row[0].is_disable
        if (select) {
          is_disable = this.is_disable
        }
        disable({
          ids: this.selectGetIds(row),
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
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        dele({
          ids: this.selectGetIds(row)
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
