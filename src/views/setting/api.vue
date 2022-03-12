<template>
  <div v-loading="loading" class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="api_name" label="接口名称" />
            <el-option value="api_url" label="接口链接" />
            <el-option value="is_unlogin" label="是否无需登录" />
            <el-option value="is_disable" label="是否禁用" />
            <el-option value="api_pid" label="PID" />
            <el-option :value="idkey" label="ID" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-checkbox v-model="isExpandAll" border title="收起/展开" @change="expandAll">收起</el-checkbox>
          <el-button class="ya-margin-left" title="修改上级" @click="selectOpen('pid')">上级</el-button>
          <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button title="无需登录" @click="selectOpen('unlogin')">登录</el-button>
          <el-button @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :rows="2" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='pid'" label="上级" prop="">
            <el-cascader
              v-model="api_pid"
              :options="data"
              :props="props"
              style="width:100%"
              clearable
              filterable
              @change="selectPidChange"
            />
          </el-form-item>
          <el-form-item v-if="selectType==='disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-if="selectType==='unlogin'" label="无需登录" prop="">
            <el-switch v-model="is_unlogin" :active-value="1" :inactive-value="0" />
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
    <el-table ref="table" :data="data" :height="height" :row-key="idkey" default-expand-all @selection-change="select" @cell-dblclick="cellDbclick">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="api_name" label="接口名称" min-width="210" />
      <el-table-column prop="api_url" label="接口链接" min-width="300">
        <template slot="header">
          <span>接口链接</span>
          <el-tooltip placement="top">
            <div slot="content">权限标识（双击单元格复制）</div>
            <i class="el-icon-warning" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="is_unlogin" label="无需登录" min-width="95" align="center">
        <template slot="header">
          <span>无需登录</span>
          <el-tooltip placement="top">
            <div slot="content">开启后不用登录也可以访问，如登录注册等</div>
            <i class="el-icon-info" title="" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_unlogin" :active-value="1" :inactive-value="0" @change="unlogin([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="是否禁用" min-width="95" align="center">
        <template slot="header">
          <span>是否禁用</span>
          <el-tooltip placement="top">
            <div slot="content">开启后无法访问</div>
            <i class="el-icon-info" title="" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column :prop="idkey" label="ID" min-width="80" />
      <el-table-column prop="api_pid" label="PID" min-width="80" />
      <el-table-column prop="api_sort" label="排序" min-width="80" />
      <el-table-column label="操作" min-width="130" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" title="添加下级" @click="add(row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height-50+'px'}">
        <el-form-item label="接口上级" prop="api_pid">
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
        <el-form-item v-if="model.create_time" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.update_time" label="修改时间" prop="update_time">
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
import { list, info, add, edit, dele, pid, disable, unlogin } from '@/api/setting/api'

export default {
  name: 'SettingApi',
  components: { },
  directives: { },
  data() {
    return {
      name: '接口',
      height: 680,
      loading: false,
      idkey: 'api_id',
      query: {
        search_field: 'api_name'
      },
      data: [],
      props: { checkStrictly: true, value: 'api_id', label: 'api_name' },
      dialog: false,
      dialogTitle: '',
      model: {
        api_id: '',
        api_pid: 0,
        api_name: '',
        api_url: '',
        api_sort: 250
      },
      rules: {
        api_name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }]
      },
      isExpandAll: false,
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      api_pid: 0,
      is_disable: 0,
      is_unlogin: 0
    }
  },
  created() {
    this.height = screenHeight(210)
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.data = res.data.list
        this.isExpandAll = false
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加修改
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
      if (row) {
        this.model.api_pid = row[this.idkey]
      }
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
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
          if (this.model[this.idkey]) {
            edit(this.model).then(res => {
              this.dialog = false
              this.$message.success(res.msg)
              this.list()
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.dialog = false
              this.$message.success(res.msg)
              this.list()
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
      this.list()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.list()
    },
    // 收起/展开
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
        if (selectType === 'pid') {
          this.selectTitle = '修改上级'
        } else if (selectType === 'disable') {
          this.selectTitle = '是否禁用'
        } else if (selectType === 'unlogin') {
          this.selectTitle = '无需登录'
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
        if (selectType === 'pid') {
          this.pid(this.selection)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'unlogin') {
          this.unlogin(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
        this.selectType = selectType
      }
    },
    // 设置上级
    pid(row) {
      pid({
        ids: this.selectGetIds(row),
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
          ids: this.selectGetIds(row),
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
    // 上级选择
    pidChange(value) {
      if (value) {
        this.model.api_pid = value[value.length - 1]
      }
    },
    selectPidChange(value) {
      if (value) {
        this.api_pid = value[value.length - 1]
      }
    },
    // 复制
    copy(text, event) {
      clip(text, event)
    },
    // 单元格双击复制
    cellDbclick(row, column, cell, event) {
      this.copy(row[column.property], event)
    }
  }
}
</script>
