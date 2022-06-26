<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row>
        <el-col class="ya-margin-bottom">
          <el-select v-model="query.search_field" class="ya-search-field" placeholder="搜索字段">
            <el-option value="file" label="文件" />
            <el-option value="admin_user_id" label="用户ID" />
            <el-option value="username" label="用户账号" />
            <el-option value="remark" label="备注" />
            <el-option :value="idkey" label="ID" />
          </el-select>
          <el-input v-model="query.search_value" class="ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="ya-date-field" placeholder="时间字段">
            <el-option value="create_time" label="备份时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="ya-date-value"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button type="primary" @click="search()">查询</el-button>
          <el-button @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 数据库表&备份列表 -->
    <el-row v-loading="loading">
      <!-- 数据库表 -->
      <el-col :span="4">
        <el-col>
          <el-button title="优化表" @click="tableSelectOpen('optimize')">优化</el-button>
          <el-button title="修复表" @click="tableSelectOpen('repair')">修复</el-button>
          <el-dialog :title="tableSelectTitle" :visible.sync="tableSelectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="120px">
              <el-form-item label="表名" prop="">
                <el-input v-model="tableSelectIds" type="textarea" :autosize="{ minRows: 2, maxRows: 12}" disabled />
              </el-form-item>
              <el-form-item v-if="tableSelectType==='optimize'">
                <span>确定要优化选中的表吗？</span>
              </el-form-item>
              <el-form-item v-else-if="tableSelectType==='repair'">
                <span>确定要修复选中的表吗？</span>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :loading="loading" @click="tableSelectCancel">取消</el-button>
              <el-button :loading="loading" type="primary" @click="tableSelectSubmit">提交</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-col>
          <el-table ref="tableSelectRef" :data="tableData" :height="height" highlight-current-row @selection-change="tableSelect" @select="tableSele" @cell-click="tableClick">
            <el-table-column type="selection" width="42" title="全选/反选" />
            <el-table-column prop="Name" label="表" show-overflow-tooltip sortable />
          </el-table>
          <el-button type="text" size="medium" style="margin:20px 0 0 10px;color:#606266">共 {{ tableData.length }} 表</el-button>
        </el-col>
      </el-col>
      <!-- 备份列表&表信息 -->
      <el-col :span="20">
        <!-- 选中操作 -->
        <el-col>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" title="添加备份" @click="add()">备份</el-button>
          <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="120px">
              <el-form-item label="备份ID" prop="">
                <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 2, maxRows: 12}" disabled />
              </el-form-item>
              <el-form-item if="selectType==='dele'">
                <span style="color:red">确定要删除选中的备份吗？</span>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :loading="loading" @click="selectCancel">取消</el-button>
              <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
            </div>
          </el-dialog>
        </el-col>
        <!-- 数据库表信息 -->
        <el-col v-if="tableName">
          <el-col :span="7">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="表名">{{ tableInfo.Name }}</el-descriptions-item>
              <el-descriptions-item label="注释">{{ tableInfo.Comment }}</el-descriptions-item>
              <el-descriptions-item label="引擎">{{ tableInfo.Engine }}</el-descriptions-item>
              <el-descriptions-item label="行">{{ tableInfo.Rows }}</el-descriptions-item>
              <el-descriptions-item label="自动递增值">{{ tableInfo.Auto_increment }}</el-descriptions-item>
              <el-descriptions-item label="排序规则">{{ tableInfo.Collation }}</el-descriptions-item>
              <el-descriptions-item label="平均每行长度">{{ tableInfo.Avg_row_length }}</el-descriptions-item>
              <el-descriptions-item label="索引长度">{{ tableInfo.Index_length }}</el-descriptions-item>
              <el-descriptions-item label="数据长度">{{ tableInfo.Data_length }}</el-descriptions-item>
              <el-descriptions-item label="最大数据长度">{{ tableInfo.Max_data_length }}</el-descriptions-item>
              <el-descriptions-item label="数据可用空间">{{ tableInfo.Data_free }}</el-descriptions-item>
              <el-descriptions-item label="行格式">{{ tableInfo.Row_format }}</el-descriptions-item>
              <el-descriptions-item label="创建选项">{{ tableInfo.Create_options }}</el-descriptions-item>
              <el-descriptions-item label="创建日期">{{ tableInfo.Create_time }}</el-descriptions-item>
              <el-descriptions-item label="修改日期">{{ tableInfo.Update_time }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="17" class="dialog-body" :style="{height:height+50+'px'}">
            <el-input v-model="tableDdl" type="textarea" :autosize="{ minRows: 25}" />
          </el-col>
        </el-col>
        <!-- 备份列表 -->
        <el-col v-else>
          <el-table ref="table" :data="data" border :height="height" @sort-change="sort" @selection-change="select">
            <el-table-column type="selection" width="42" title="全选/反选" />
            <el-table-column :prop="idkey" label="ID" min-width="100" sortable="custom" />
            <el-table-column prop="file" label="文件" min-width="230" show-overflow-tooltip />
            <el-table-column prop="size" label="大小" min-width="90" />
            <el-table-column prop="table_num" label="表数" min-width="80" />
            <el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip />
            <el-table-column prop="admin_user_id" label="用户ID" min-width="70" show-overflow-tooltip />
            <el-table-column prop="username" label="用户账号" min-width="100" show-overflow-tooltip />
            <el-table-column prop="create_time" label="备份时间" min-width="155" sortable="custom" />
            <el-table-column label="操作" min-width="120" align="right" fixed="right">
              <template slot-scope="{ row }">
                <el-button size="mini" type="text" @click="down(row)">下载</el-button>
                <el-button size="mini" type="text" @click="restore(row)">还原</el-button>
                <el-button size="mini" type="text" title="详情/修改" @click="edit(row)">修改</el-button>
                <el-button size="mini" type="text" @click="selectOpen('dele',row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
        </el-col>
      </el-col>
    </el-row>
    <!-- 备份 -->
    <el-dialog title="数据库备份" :visible.sync="dialogAdd" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="备份表" prop="table">
          <el-table ref="addRef" :data="tableData" :height="height-80" @selection-change="addChange">
            <el-table-column type="selection" width="42" title="全选/反选" />
            <el-table-column prop="Name" label="表名" min-width="200" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.Name }} </span>
                <i v-if="scope.row.is_ignore" class="el-icon-warning-outline" title="忽略的表" />
              </template>
            </el-table-column>
            <el-table-column prop="Comment" label="注释" min-width="180" show-overflow-tooltip />
            <el-table-column prop="Rows" label="行" min-width="80" show-overflow-tooltip />
            <el-table-column prop="Auto_increment" label="自动递增值" min-width="100" show-overflow-tooltip />
            <el-table-column prop="Index_length" label="索引长度" min-width="100" show-overflow-tooltip />
            <el-table-column prop="Data_length" label="数据长度" min-width="100" show-overflow-tooltip />
            <el-table-column prop="Engine" label="引擎" min-width="80" show-overflow-tooltip />
          </el-table>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" placeholder="" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit('add')">提交</el-button>
      </div>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="editModel" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="文件" prop="file">
          <el-input v-model="editModel.file" placeholder="" clearable disabled />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="editModel.path" placeholder="" clearable disabled />
        </el-form-item>
        <el-form-item label="表数量" prop="table_num">
          <el-input v-model="editModel.table_num" placeholder="" clearable disabled />
        </el-form-item>
        <el-form-item label="备份表" prop="table">
          <el-input v-model="editModel.table" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" disabled />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editModel.remark" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="用户ID" prop="admin_user_id">
          <el-input v-model="editModel.admin_user_id" disabled />
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="editModel.username" disabled />
        </el-form-item>
        <el-form-item label="备份时间" prop="create_time">
          <el-input v-model="editModel.create_time" disabled />
        </el-form-item>
        <el-form-item label="修改时间" prop="update_time">
          <el-input v-model="editModel.update_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit('edit')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, down, restore, optimize, repair } from '@/api/admin/database'

export default {
  name: 'AdminDatabase',
  components: { Pagination },
  data() {
    return {
      name: '数据库',
      height: 680,
      loading: false,
      idkey: 'admin_database_id',
      query: {
        page: 1,
        limit: 15,
        search_field: 'file',
        search_value: '',
        date_field: 'create_time',
        date_value: [],
        is_extra: 1
      },
      data: [],
      count: 0,
      dialog: false,
      dialogAdd: false,
      dialogTitle: '',
      model: {
        table: [],
        remark: ''
      },
      editModel: {
        admin_database_id: '',
        admin_user_id: 0,
        table: '',
        remark: ''
      },
      rules: {},
      tableData: [],
      tableName: '',
      tableInfo: {},
      tableDdl: '',
      tableSelection: [],
      tableSelectIds: '',
      tableSelectTitle: '选中操作',
      tableSelectDialog: false,
      tableSelectType: '',
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: ''
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
        if (this.query.is_extra) {
          this.tableData = res.data.table
        }
        this.query.is_extra = 0
        this.tableName = ''
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 备份修改
    add() {
      this.dialogAdd = true
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = '备份修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.editModel = res.data
      }).catch()
    },
    cancel() {
      this.dialog = false
      this.dialogAdd = false
      this.reset()
    },
    submit(type) {
      this.loading = true
      if (type === 'add') {
        add(this.model).then(res => {
          this.list()
          this.reset()
          this.dialogAdd = false
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      } else if (type === 'edit') {
        edit(this.editModel).then(res => {
          this.list()
          this.reset()
          this.dialog = false
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    addChange(selection) {
      this.model.table = arrayColumn(selection, 'Name')
    },
    // 重置
    reset() {
      this.model = this.$options.data().model
      this.editModel = this.$options.data().editModel
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
      this.$alert('请选择需要操作的备份', '提示', { type: 'warning', callback: action => {} })
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
        if (selectType === 'dele') {
          this.selectTitle = '删除备份'
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
        if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
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
    },
    // 下载
    down(row) {
      var id = {}
      id[this.idkey] = row[this.idkey]
      down(id).then(res => {
        console.log(res)
        const blob = new Blob([res])
        const url = window.URL.createObjectURL(blob)
        const ele = document.createElement('a')
        ele.style.display = 'none'
        ele.href = url
        ele.setAttribute('download', row.file)
        document.body.appendChild(ele)
        ele.click()
      }).catch(() => {
      })
    },
    // 还原
    restore(row) {
      const content = '确定恢复备份？<br><span style="color:red">建议先备份当前数据后再进行恢复操作！！！<br>当前数据库将被清空覆盖，请谨慎操作！！！</span>'
      this.$confirm(content, '还原提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.loading = true
        var id = {}
        id[this.idkey] = row[this.idkey]
        restore(id).then(res => {
          this.loading = false
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
      })
    },
    // 数据库表选中操作
    tableSelect(selection) {
      this.tableSelection = selection
      this.tableSelectIds = this.tableSelectGetIds(selection).toString()
    },
    tableSelectGetIds(selection) {
      return arrayColumn(selection, 'Name')
    },
    tableSelectAlert() {
      this.$alert('请选择需要操作的表', '提示', { type: 'warning', callback: action => {} })
    },
    tableSelectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['tableSelectRef'].clearSelection()
        this.$refs['tableSelectRef'].toggleRowSelection(selectRow)
      }
      if (!this.tableSelection.length) {
        this.tableSelectAlert()
      } else {
        this.tableSelectTitle = '选中操作'
        if (selectType === 'optimize') {
          this.tableSelectTitle = '优化表'
        } else if (selectType === 'repair') {
          this.tableSelectTitle = '修复表'
        }
        this.tableSelectDialog = true
        this.tableSelectType = selectType
      }
    },
    tableSelectCancel() {
      this.tableSelectDialog = false
    },
    tableSelectSubmit() {
      if (!this.tableSelection.length) {
        this.tableSelectAlert()
      } else {
        const selectType = this.tableSelectType
        if (selectType === 'optimize') {
          this.optimize(this.tableSelection)
        } else if (selectType === 'repair') {
          this.repair(this.tableSelection)
        }
        this.tableSelectDialog = false
      }
    },
    tableSele(selection, row) {
      this.information(row.Name)
    },
    tableClick(row, column, cell, event) {
      const field = column.property
      if (field === 'Name') {
        this.information(row[field])
      }
    },
    // 优化表
    optimize(row) {
      if (!row.length) {
        this.tableSelectAlert()
      } else {
        this.loading = true
        optimize({
          table: this.tableSelectGetIds(row)
        }).then(res => {
          this.loading = false
          this.$refs['tableSelectRef'].clearSelection()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修复表
    repair(row) {
      if (!row.length) {
        this.tableSelectAlert()
      } else {
        this.loading = true
        repair({
          table: this.tableSelectGetIds(row)
        }).then(res => {
          this.loading = false
          this.$refs['tableSelectRef'].clearSelection()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 表信息
    information(table_name) {
      if (table_name) {
        this.tableName = table_name
        info({ table_name: this.tableName }).then(res => {
          this.tableInfo = res.data.info
          this.tableDdl = res.data.ddl
        })
      }
    }
  }
}
</script>
