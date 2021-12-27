<template>
  <div class="app-container">
    <!-- 查询、选中操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-checkbox v-model="isExpandAll" border @change="expandAll">收起</el-checkbox>
          <el-button class="ya-margin-left" @click="selectOpen('pid')">父级</el-button>
          <el-button @click="selectOpen('disable')">禁用</el-button>
          <el-button @click="selectOpen('unlogin')">登录</el-button>
          <el-button @click="dele(selection)">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog title="选中操作" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item v-if="selectType==='pid'" label="父级" prop="">
            <el-cascader
              v-model="api_pid"
              :options="data"
              :props="props"
              style="width:100%"
              placeholder="请选择"
              clearable
              filterable
              @change="selectPidChange"
            />
          </el-form-item>
          <el-form-item v-if="selectType==='disable'" label="禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-if="selectType==='unlogin'" label="无需登录" prop="">
            <el-switch v-model="is_unlogin" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectCancel">取消</el-button>
          <el-button type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" row-key="api_id" @selection-change="select" @cell-dblclick="tableCellDbclick">
      <el-table-column type="selection" width="42" title="全选/反选" />
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
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
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
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_unlogin" :active-value="1" :inactive-value="0" @change="unlogin([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="api_id" label="ID" min-width="80" />
      <el-table-column prop="api_sort" label="排序" min-width="80" />
      <el-table-column label="操作" min-width="130" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" title="添加下级" @click="add(row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="接口父级" prop="api_pid">
          <el-cascader
            v-model="model.api_pid"
            :options="data"
            :props="props"
            style="width:100%"
            placeholder="一级接口"
            clearable
            filterable
            @change="pidChange"
          />
        </el-form-item>
        <el-form-item label="接口名称" prop="api_name">
          <el-input v-model="model.api_name" placeholder="请输入接口名称" clearable />
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="model.api_url" placeholder="应用/控制器/操作，区分大小写">
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.api_url, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="接口排序" prop="api_sort">
          <el-input v-model="model.api_sort" type="number" placeholder="250" />
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
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, pid, disable, unlogin } from '@/api/api'

export default {
  name: 'SettingApi',
  components: { },
  directives: { },
  data() {
    return {
      name: '接口',
      height: 680,
      loading: false,
      data: [],
      dialog: false,
      dialogTitle: '',
      props: { checkStrictly: true, value: 'api_id', label: 'api_name' },
      model: {
        api_id: '',
        api_pid: 0,
        api_name: '',
        api_method: 'GET',
        api_url: '',
        api_sort: 250
      },
      isExpandAll: true,
      selection: [],
      selectDialog: false,
      selectType: '',
      api_pid: 0,
      is_disable: 0,
      is_unlogin: 0,
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
    // 添加修改
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.model = this.$options.data().model
      if (row) {
        this.model.api_pid = row.api_id
      }
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.api_id
      info({
        api_id: row.api_id
      }).then(res => {
        this.reset(res.data)
      }).catch(() => {})
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.api_id) {
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
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].api_id
          message = '确定要删除' + this.name + ' <span style="color:red">' + row[0].api_name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            ids: arrayColumn(row, 'api_id')
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
    },
    // 刷新
    refresh() {
      this.list()
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
    // 选中操作
    select(selection) {
      this.selection = selection
    },
    selectAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => {} })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        this.$refs['table'].toggleRowSelection(selectRow)
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
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
        const type = this.selectType
        if (type === 'pid') {
          this.setpid(this.selection, true)
        } else if (type === 'disable') {
          this.disable(this.selection, true)
        } else if (type === 'unlogin') {
          this.unlogin(this.selection, true)
        }
        this.selectDialog = false
      }
    },
    selectPidChange(value) {
      if (value) {
        this.api_pid = value[value.length - 1]
      }
    },
    // 设置父级
    setpid(row) {
      pid({
        ids: arrayColumn(row, 'api_id'),
        api_pid: this.api_pid
      }).then(res => {
        this.list()
        this.selectDialog = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
      })
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
          ids: arrayColumn(row, 'api_id'),
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
    // 是否无需登录
    unlogin(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_unlogin = row[0].is_unlogin
        if (select) {
          is_unlogin = this.is_unlogin
        }
        unlogin({
          ids: arrayColumn(row, 'api_id'),
          is_unlogin: is_unlogin
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 父级选择
    pidChange(value) {
      if (value) {
        this.model.api_pid = value[value.length - 1]
      }
    },
    // 复制
    copy(text, event) {
      clip(text, event)
    },
    // 表格单元格双击
    tableCellDbclick(row, column, cell, event) {
      this.copy(row[column.property], event)
    }
  }
}
</script>
