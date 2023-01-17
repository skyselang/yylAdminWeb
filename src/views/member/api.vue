<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option :value="idkey" label="ID" />
            <el-option value="api_pid" label="上级" />
            <el-option value="api_name" label="名称" />
            <el-option value="api_url" label="链接" />
            <el-option value="is_unlogin" label="免登" />
            <el-option value="is_unauth" label="免权" />
            <el-option value="is_unrate" label="免限" />
            <el-option value="is_disable" label="禁用" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-cascader v-if="query.search_field==='api_pid'" v-model="query.search_value" :options="trees" :props="props" class="filter-item ya-search-value" clearable filterable />
          <el-select v-else-if="query.search_field==='is_unlogin'||query.search_field==='is_unauth'||query.search_field==='is_unrate'||query.search_field==='is_disable'" v-model="query.search_value" class="filter-item ya-search-value">
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="查询内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker v-model="query.date_value" type="daterange" class="filter-item ya-date-value" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
          <el-button class="filter-item" type="primary" title="查询/刷新" @click="search()">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" title="重置" @click="refresh()" />
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-checkbox v-model="isExpandAll" style="margin-right:10px;top:-2px" border title="收起/展开" @change="expandAll">收起</el-checkbox>
          <el-button title="解除分组" @click="selectOpen('removeg')">分组</el-button>
          <el-button title="修改排序" @click="selectOpen('editsort')">排序</el-button>
          <el-button title="修改上级" @click="selectOpen('editpid')">上级</el-button>
          <el-button title="是否免登" @click="selectOpen('unlogin')">免登</el-button>
          <el-button title="是否免权" @click="selectOpen('unauth')">免权</el-button>
          <el-button title="是否免限" @click="selectOpen('unrate')">免限</el-button>
          <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 5, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='removeg'" label="" prop="">
            <span style="">确定要解除选中的{{ name }}的分组吗？</span>
          </el-form-item>
          <el-form-item v-else-if="selectType==='editsort'" label="排序" prop="">
            <el-input v-model="sort" type="number" placeholder="排序" />
            <el-input v-model="sort_incdec" type="text" placeholder="0">
              <template slot="append">按{{ name }}ID顺序递增或递减排序</template>
            </el-input>
          </el-form-item>
          <el-form-item v-else-if="selectType==='editpid'" label="上级" prop="">
            <el-cascader v-model="api_pid" :options="trees" :props="props" style="width:100%" placeholder="一级接口" clearable filterable />
          </el-form-item>
          <el-form-item v-else-if="selectType==='unlogin'" label="是否免登" prop="">
            <el-switch v-model="is_unlogin" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='unauth'" label="是否免权" prop="">
            <el-switch v-model="is_unauth" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='unrate'" label="是否免限" prop="">
            <el-switch v-model="is_unrate" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='dele'" label="" prop="">
            <span style="color:red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="loading" @click="selectCancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" :row-key="idkey" default-expand-all @selection-change="select" @select-all="selectAll" @cell-dblclick="cellDbclick">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="api_name" label="接口名称" min-width="210" show-overflow-tooltip />
      <el-table-column prop="api_url" label="接口链接" min-width="300" show-overflow-tooltip />
      <el-table-column :prop="idkey" label="ID" width="80" />
      <el-table-column prop="is_unlogin" label="免登" min-width="70">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_unlogin" :active-value="1" :inactive-value="0" @change="unlogin([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unauth" label="免权" min-width="70">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_unauth" :active-value="1" :inactive-value="0" @change="unauth([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unrate" label="免限" min-width="70">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_unrate" :active-value="1" :inactive-value="0" @change="unrate([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="70">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="80" />
      <el-table-column label="操作" width="155">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="groupShow(scope.row)">分组</el-button>
          <el-button size="mini" type="text" title="添加下级" @click="add(scope.row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height-50+'px'}">
        <el-form-item label="接口上级" prop="api_pid">
          <el-cascader v-model="model.api_pid" :options="trees" :props="props" style="width:100%" placeholder="一级接口" clearable filterable />
        </el-form-item>
        <el-form-item label="接口名称" prop="api_name">
          <el-input v-model="model.api_name" placeholder="请输入接口名称" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.api_name, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="model.api_url" placeholder="应用/控制器/操作，区分大小写" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.api_url, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" placeholder="250" />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
          <el-input v-model="model.delete_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 分组 -->
    <el-dialog :title="groupDialogTitle" :visible.sync="groupDialog" width="70%" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button type="primary" title="解除" @click="groupSelectOpen('groupRemove')">解除</el-button>
        </el-col>
      </el-row>
      <!-- 分组列表 -->
      <el-table ref="groupRef" v-loading="groupLoad" :data="groupData" :height="height-70" @sort-change="groupSort" @selection-change="groupSelect">
        <el-table-column type="selection" width="42" title="全选/反选" />
        <el-table-column :prop="groupPk" label="分组ID" min-width="100" sortable="custom" />
        <el-table-column prop="group_name" label="分组名称" min-width="130" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="group_desc" label="分组描述" min-width="130" show-overflow-tooltip />
        <el-table-column prop="is_disable" label="禁用" min-width="75" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="groupSelectOpen('groupRemove',scope.row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="groupCount>0" :total="groupCount" :page.sync="groupQuery.page" :limit.sync="groupQuery.limit" @pagination="groupList" />
    </el-dialog>
    <el-dialog :title="groupSelectTitle" :visible.sync="groupSelectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="groupSelectRef" label-width="120px">
        <el-form-item :label="groupName+'ID'" prop="">
          <el-input v-model="groupSelectIds" type="textarea" :autosize="{minRows: 5, maxRows: 12}" disabled />
        </el-form-item>
        <el-form-item v-if="groupSelectType==='groupRemove'" :label="name+'ID'" prop="">
          <span>{{ groupQuery[idkey] }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupSelectCancel">取消</el-button>
        <el-button type="primary" @click="groupSelectSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, editsort, editpid, unlogin, unauth, unrate, disable, group, groupRemove } from '@/api/member/api'

export default {
  name: 'MemberApi',
  components: { Pagination },
  directives: {},
  data() {
    return {
      name: '会员接口',
      height: 680,
      loading: false,
      idkey: 'api_id',
      exps: [],
      query: { search_field: 'api_name', search_exp: 'like', date_field: 'create_time' },
      data: [],
      dialog: false,
      dialogTitle: '',
      model: {
        api_id: '',
        api_pid: 0,
        api_name: '',
        api_url: '',
        sort: 250
      },
      rules: {
        api_name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }]
      },
      trees: [],
      props: { checkStrictly: true, value: 'api_id', label: 'api_name', emitPath: false },
      isExpandAll: false,
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      sort: 250,
      sort_incdec: '0',
      api_pid: 0,
      is_unlogin: 0,
      is_unauth: 0,
      is_unrate: 0,
      is_disable: 0,
      groupPk: 'group_id',
      groupName: '分组',
      groupDialog: false,
      groupDialogTitle: '',
      groupLoad: false,
      groupData: [],
      groupCount: 0,
      groupQuery: { page: 1, limit: 12 },
      groupSelection: [],
      groupSelectIds: '',
      groupSelectTitle: '选中操作',
      groupSelectDialog: false,
      groupSelectType: ''
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
        this.trees = res.data.tree
        this.exps = res.data.exps
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
      }).catch(() => { })
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
      this.list()
    },
    // 刷新
    refresh() {
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.$refs['table'].clearSort()
      this.query.limit = limit
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
    selectAll(selection) {
      if (selection) {
        this.selectAllKeys(selection)
        this.selectIds = this.selectGetIds(this.selection).toString()
      } else {
        this.selectIds = ''
      }
    },
    selectAllKeys(tree) {
      for (const i in tree) {
        this.selection.push(tree[i])
        if (tree[i].children) {
          this.selectAllKeys(tree[i].children)
        }
      }
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => { } })
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
        if (selectType === 'removeg') {
          this.selectTitle = this.name + '解除分组'
        } else if (selectType === 'editsort') {
          this.selectTitle = this.name + '修改排序'
        } else if (selectType === 'editpid') {
          this.selectTitle = this.name + '修改上级'
        } else if (selectType === 'unlogin') {
          this.selectTitle = this.name + '是否免登'
        } else if (selectType === 'unauth') {
          this.selectTitle = this.name + '是否免权'
        } else if (selectType === 'unrate') {
          this.selectTitle = this.name + '是否免限'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
        } else if (selectType === 'dele') {
          this.selectTitle = this.name + '删除'
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
        if (selectType === 'removeg') {
          this.removeg(this.selection)
        } else if (selectType === 'editsort') {
          this.editsort(this.selection)
        } else if (selectType === 'editpid') {
          this.editpid(this.selection)
        } else if (selectType === 'unlogin') {
          this.unlogin(this.selection, true)
        } else if (selectType === 'unauth') {
          this.unauth(this.selection, true)
        } else if (selectType === 'unrate') {
          this.unrate(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 解除分组
    removeg(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        groupRemove({
          api_id: this.selectGetIds(row),
          group_ids: []
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修改排序
    editsort(row) {
      this.loading = true
      editsort({
        ids: this.selectGetIds(row),
        sort: this.sort,
        sort_incdec: this.sort_incdec
      }).then(res => {
        this.list()
        this.sort_incdec = '0'
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 修改上级
    editpid(row) {
      this.loading = true
      editpid({
        ids: this.selectGetIds(row),
        api_pid: this.api_pid
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 是否免登
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
        })
      }
    },
    // 是否免限
    unrate(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_unrate = row[0].is_unrate
        if (select) {
          is_unrate = this.is_unrate
        }
        unrate({
          ids: this.selectGetIds(row),
          is_unrate: is_unrate
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
        })
      }
    },
    // 是否免权
    unauth(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_unauth = row[0].is_unauth
        if (select) {
          is_unauth = this.is_unauth
        }
        unauth({
          ids: this.selectGetIds(row),
          is_unauth: is_unauth
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
        })
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
    // 分组显示
    groupShow(row) {
      this.groupDialog = true
      this.groupDialogTitle = this.name + this.groupName + '：' + row.api_name
      this.groupQuery.api_id = row.api_id
      this.groupList()
    },
    // 分组列表
    groupList() {
      this.groupLoad = true
      group(this.groupQuery).then(res => {
        this.groupData = res.data.list
        this.groupCount = res.data.count
        this.groupLoad = false
      }).catch(() => {
        this.groupLoad = false
      })
    },
    // 分组排序
    groupSort(sort) {
      this.groupQuery.sort_field = sort.prop
      this.groupQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.groupQuery.sort_value = 'asc'
        this.groupList()
      }
      if (sort.order === 'descending') {
        this.groupQuery.sort_value = 'desc'
        this.groupList()
      }
    },
    // 分组选中操作
    groupSelect(selection) {
      this.groupSelection = selection
      this.groupSelectIds = this.groupSelectGetIds(selection).toString()
    },
    groupSelectGetIds(selection) {
      return arrayColumn(selection, this.groupPk)
    },
    groupSelectAlert() {
      this.$alert('请选择需要操作的' + this.groupName, '提示', { type: 'warning', callback: action => { } })
    },
    groupSelectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['groupRef'].clearSelection()
        this.$refs['groupRef'].toggleRowSelection(selectRow)
      }
      if (!this.groupSelection.length) {
        this.groupSelectAlert()
      } else {
        this.groupSelectTitle = '选中操作'
        if (selectType === 'groupRemove') {
          this.groupSelectTitle = this.name + '解除' + this.groupName
        }
        this.groupSelectDialog = true
        this.groupSelectType = selectType
      }
    },
    groupSelectCancel() {
      this.groupSelectDialog = false
    },
    groupSelectSubmit() {
      if (!this.groupSelection.length) {
        this.groupSelectAlert()
      } else {
        const selectType = this.groupSelectType
        if (selectType === 'groupRemove') {
          this.groupRemove(this.groupSelection)
        }
        this.groupSelectDialog = false
      }
    },
    // 分组解除
    groupRemove(row) {
      if (!row.length) {
        this.groupSelectAlert()
      } else {
        this.groupLoad = true
        groupRemove({
          api_id: this.groupQuery.api_id,
          group_ids: this.groupSelectGetIds(row)
        }).then(res => {
          this.groupList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.groupLoad = false
        })
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
