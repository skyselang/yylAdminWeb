<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="group_name" label="名称" />
          <el-option value="group_desc" label="描述" />
          <el-option value="remark" label="备注" />
          <el-option value="is_default" label="默认" />
          <el-option value="is_disable" label="禁用" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-select
          v-if="query.search_field === 'is_disable' || query.search_field === 'is_default'"
          v-model="query.search_value"
          class="ya-search-value"
        >
          <el-option :value="1" label="是" />
          <el-option :value="0" label="否" />
        </el-select>
        <el-input v-else v-model="query.search_value" class="ya-search-value" placeholder="查询内容" clearable />
        <el-select v-model="query.date_field" class="ya-date-field" placeholder="时间类型">
          <el-option value="create_time" label="添加时间" />
          <el-option value="update_time" label="修改时间" />
        </el-select>
        <el-date-picker
          v-model="query.date_value"
          type="datetimerange"
          class="ya-date-value"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[new Date(2024, 1, 1, 0, 0, 0), new Date(2024, 1, 1, 23, 59, 59)]"
        />
        <el-button type="primary" title="查询/刷新" @click="search()">查询</el-button>
        <el-button type="default" title="重置查询条件" @click="refresh()">重置</el-button>
        <el-button type="primary" @click="add()">添加</el-button>
      </el-col>
    </el-row>
    <!-- 操作 -->
    <el-row>
      <el-col>
        <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
        <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
        <el-button title="是否默认" @click="selectOpen('defaults')">默认</el-button>
        <el-button title="修改接口" @click="selectOpen('editapi')">接口</el-button>
        <el-button title="解除会员" @click="selectOpen('removem')">解除会员</el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-model="selectDialog"
      :title="selectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
    >
      <el-scrollbar native :height="height - 200">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item v-if="selectType === 'removem'">
            <span style="">确定要解除选中的{{ name }}的会员吗？</span>
          </el-form-item>
          <el-form-item v-else-if="selectType === 'editapi'" label="会员接口">
            <el-col>
              <el-checkbox v-model="apiExpandAll" title="展开/收起" @change="apiExpandAllChange('selApiRef')">
                展开
              </el-checkbox>
              <el-checkbox v-model="apiCheckAll" title="全选/反选" @change="apiCheckAllChange('selApiRef')">
                全选
              </el-checkbox>
            </el-col>
            <el-tree
              ref="selApiRef"
              :data="apiData"
              :props="apiProps"
              :default-checked-keys="api_ids"
              node-key="api_id"
              show-checkbox
              check-strictly
              :expand-on-click-node="false"
              @check="apiCheck('selApiRef')"
            >
              <template #default="scope">
                <span class="custom-tree-node">
                  <span>{{ scope.node.label }}</span>
                  <span v-if="scope.data.children" style="margin-left: 10px">
                    <el-checkbox title="全选/反选" @change="apiCheckAllChangePid(scope.node, scope.data, 'selApiRef')">
                      全选
                    </el-checkbox>
                  </span>
                  <span>
                    <i v-if="scope.data.api_url" style="margin-left: 10px" :title="scope.data.api_url">
                      <svg-icon icon-class="link" />
                    </i>
                    <i v-else style="margin-left: 10px; color: #fff">
                      <svg-icon icon-class="link" />
                    </i>
                    <i v-if="scope.data.is_unlogin" style="margin-left: 10px" title="免登">
                      <svg-icon icon-class="user" />
                    </i>
                    <i v-else style="margin-left: 10px; color: #fff">
                      <svg-icon icon-class="user" />
                    </i>
                    <i v-if="scope.data.is_unauth" style="margin-left: 10px" title="免权">
                      <svg-icon icon-class="unlock" />
                    </i>
                    <i v-else style="margin-left: 10px; color: #fff">
                      <svg-icon icon-class="unlock" />
                    </i>
                  </span>
                </span>
              </template>
            </el-tree>
          </el-form-item>
          <el-form-item v-else-if="selectType === 'defaults'" label="是否默认">
            <el-switch v-model="is_default" :active-value="1" :inactive-value="0" />
            <span> {{ memberName }} 新增时默认的分组</span>
          </el-form-item>
          <el-form-item v-else-if="selectType === 'disable'" label="是否禁用">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'dele'">
            <span class="c-red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
          <el-form-item :label="name + 'ID'">
            <el-input v-model="selectIds" type="textarea" autosize disabled />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="selectCancel">取消</el-button>
        <el-button type="primary" @click="selectSubmit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 列表 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :height="height"
      @sort-change="sort"
      @selection-change="select"
    >
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="group_name" label="名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="group_desc" label="描述" min-width="220" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
      <el-table-column prop="is_default_name" label="默认" min-width="85" sortable="custom" />
      <el-table-column prop="is_disable_name" label="禁用" min-width="85" sortable="custom" />
      <el-table-column prop="sort" label="排序" min-width="85" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" width="165" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" width="165" sortable="custom" />
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-link type="primary" class="mr-1" :underline="false" @click="memberShow(scope.row)"> 会员 </el-link>
          <el-link type="primary" class="mr-1" :underline="false" @click="edit(scope.row)"> 修改 </el-link>
          <el-link type="primary" :underline="false" @click="selectOpen('dele', [scope.row])"> 删除 </el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="count > 0"
      v-model:total="count"
      v-model:page="query.page"
      v-model:limit="query.limit"
      @pagination="list"
    />
    <!-- 添加修改 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      top="5vh"
      destroy-on-close
    >
      <el-scrollbar native :height="height - 30">
        <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
          <el-form-item label="名称" prop="group_name">
            <el-input v-model="model.group_name" placeholder="请输入名称" clearable />
          </el-form-item>
          <el-form-item label="描述" prop="group_desc">
            <el-input v-model="model.group_desc" type="textarea" autosize placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="model.remark" placeholder="请输入备注" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="sort" placeholder="250">
            <el-input v-model="model.sort" type="number" />
          </el-form-item>
          <el-form-item label="接口">
            <el-col :span="24">
              <el-checkbox v-model="apiExpandAll" title="展开/收起" @change="apiExpandAllChange('apiRef')">
                展开
              </el-checkbox>
              <el-checkbox v-model="apiCheckAll" title="全选/反选" @change="apiCheckAllChange('apiRef')">
                全选
              </el-checkbox>
            </el-col>
            <el-col :span="24">
              <el-tree
                ref="apiRef"
                :data="apiData"
                :props="apiProps"
                :default-checked-keys="model.api_ids"
                node-key="api_id"
                show-checkbox
                check-strictly
                :expand-on-click-node="false"
                @check="apiCheck('apiRef')"
              >
                <template #default="scope">
                  <span class="custom-tree-node">
                    <span>{{ scope.node.label }}</span>
                    <span v-if="scope.data.children" style="margin-left: 10px">
                      <el-checkbox title="全选/反选" @change="apiCheckAllChangePid(scope.node, scope.data, 'apiRef')">
                        全选
                      </el-checkbox>
                    </span>
                    <span>
                      <i v-if="scope.data.api_url" style="margin-left: 10px" :title="scope.data.api_url">
                        <svg-icon icon-class="link" />
                      </i>
                      <i v-else style="margin-left: 10px; color: #fff">
                        <svg-icon icon-class="link" />
                      </i>
                      <i v-if="scope.data.is_unlogin" style="margin-left: 10px" title="免登">
                        <svg-icon icon-class="user" />
                      </i>
                      <i v-else style="margin-left: 10px; color: #fff">
                        <svg-icon icon-class="user" />
                      </i>
                      <i v-if="scope.data.is_unauth" style="margin-left: 10px" title="免权">
                        <svg-icon icon-class="unlock" />
                      </i>
                      <i v-else style="margin-left: 10px; color: #fff">
                        <svg-icon icon-class="unlock" />
                      </i>
                    </span>
                  </span>
                </template>
              </el-tree>
            </el-col>
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
      </el-scrollbar>
      <template #footer>
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 分组会员 -->
    <el-dialog
      v-model="memberDialog"
      :title="memberDialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="5vh"
      width="70%"
    >
      <!-- 分组会员操作 -->
      <el-row>
        <el-col>
          <el-button type="primary" title="解除" @click="memberSelectOpen('memberRemove')"> 解除 </el-button>
          <el-input v-model="memberQuery.search_value" class="ya-search-value" placeholder="昵称" clearable />
          <el-button type="primary" @click="member()">查询</el-button>
        </el-col>
      </el-row>
      <!-- 分组会员列表 -->
      <el-table
        ref="memberRef"
        v-loading="memberLoad"
        :data="memberData"
        :height="height - 50"
        @sort-change="memberSort"
        @selection-change="memberSelect"
      >
        <el-table-column type="selection" width="42" title="全选/反选" />
        <el-table-column :prop="memberPk" label="会员ID" min-width="100" sortable="custom" />
        <el-table-column prop="avatar_id" label="头像" min-width="62">
          <template #default="scope">
            <FileImage :file-url="scope.row.avatar_url" avatar lazy />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="150" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="username" label="用户名" min-width="145" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机" min-width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" min-width="180" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="tag_names" label="标签" min-width="170" show-overflow-tooltip />
        <el-table-column prop="group_names" label="分组" width="170" show-overflow-tooltip />
        <el-table-column label="操作" min-width="70">
          <template #default="scope">
            <el-link type="primary" :underline="false" @click="memberSelectOpen('memberRemove', scope.row)">
              解除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分组会员分页 -->
      <pagination
        v-show="memberCount > 0"
        v-model:total="memberCount"
        v-model:page="memberQuery.page"
        v-model:limit="memberQuery.limit"
        @pagination="member"
      />
    </el-dialog>
    <el-dialog
      v-model="memberSelectDialog"
      :title="memberSelectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
    >
      <el-form ref="memberSelectRef" label-width="120px">
        <el-form-item v-if="memberSelectType === 'memberRemove'" label="分组ID">
          <span>{{ memberQuery[idkey] }}</span>
        </el-form-item>
        <el-form-item :label="memberName + 'ID'">
          <el-input v-model="memberSelectIds" type="textarea" autosize disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="memberSelectCancel">取消</el-button>
        <el-button type="primary" @click="memberSelectSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import { arrayColumn } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import { list, info, add, edit, dele, editapi, defaults, disable, memberList, memberRemove } from '@/api/member/group'

export default {
  name: 'MemberGroup',
  components: { Pagination },
  data() {
    return {
      name: '会员分组',
      height: 680,
      loading: false,
      idkey: 'group_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'group_name',
        search_exp: 'like',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        group_id: '',
        group_name: '',
        group_desc: '',
        remark: '',
        sort: 250,
        api_ids: []
      },
      rules: {
        group_name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
      },
      apiIds: [],
      apiData: [],
      apiProps: { children: 'children', label: 'api_name' },
      apiCheckAll: false,
      apiExpandAll: false,
      apiCheckAllPid: {},
      selApiRefs: 'apiRef',
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: '',
      is_default: 0,
      is_disable: 0,
      api_ids: [],
      memberPk: 'member_id',
      memberName: '会员',
      memberDialog: false,
      memberDialogTitle: '',
      memberLoad: false,
      memberData: [],
      memberCount: 0,
      memberQuery: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'nickname',
        search_exp: 'like',
        search_value: ''
      },
      memberSelection: [],
      memberSelectIds: '',
      memberSelectTitle: '操作',
      memberSelectDialog: false,
      memberSelectType: ''
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
      list(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.apiData = res.data.api
          this.apiIds = res.data.api_ids
          this.exps = res.data.exps
          this.loading = false
        })
        .catch(() => {
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
      info(id)
        .then((res) => {
          this.reset(res.data)
        })
        .catch(() => {})
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.model[this.idkey]) {
            edit(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            add(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
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
      this.apiCheckAll = false
      this.apiExpandAll = false
      this.apiCheckAllPid = {}
      if (this.$refs['ref'] !== undefined) {
        try {
          this.$refs['ref'].resetFields()
          this.$refs['ref'].clearValidate()
        } catch (error) {}
      }
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 重置查询
    refresh() {
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.$refs['table'].clearSort()
      this.query.limit = limit
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
    // 操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds(selection).toString()
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      ElMessageBox.alert('请选择需要操作的' + this.name, '提示', {
        type: 'warning',
        callback: () => {}
      })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        const selectRowLen = selectRow.length
        for (let i = 0; i < selectRowLen; i++) {
          this.$refs['table'].toggleRowSelection(selectRow[i], true)
        }
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '操作'
        if (selectType === 'removem') {
          this.selectTitle = this.name + '解除会员'
        } else if (selectType === 'editapi') {
          this.selectTitle = this.name + '修改接口'
        } else if (selectType === 'defaults') {
          this.selectTitle = this.name + '是否默认'
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
        if (selectType === 'removem') {
          this.removem(this.selection)
        } else if (selectType === 'editapi') {
          this.editapi(this.selection)
        } else if (selectType === 'defaults') {
          this.defaults(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 解除会员
    removem(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        memberRemove({
          group_id: this.selectGetIds(row),
          member_ids: []
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 修改接口
    editapi(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editapi({
          ids: this.selectGetIds(row),
          api_ids: this.api_ids
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 是否默认
    defaults(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_default = row[0].is_default
        if (select) {
          is_default = this.is_default
        }
        defaults({
          ids: this.selectGetIds(row),
          is_default: is_default
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
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
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
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
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 接口选择
    apiCheck(refs = 'apiRef') {
      this.selApiRefs = refs
      this.apiCheckSetKeys()
    },
    apiCheckAllChange(refs = 'apiRef') {
      this.selApiRefs = refs
      if (this.apiCheckAll) {
        this.apiIds.forEach((item) => {
          this.$refs[this.selApiRefs].setChecked(item, true, true)
        })
      } else {
        this.$refs[this.selApiRefs].setCheckedKeys([])
      }
      this.apiCheckSetKeys()
    },
    apiExpandAllChange(refs = 'apiRef') {
      this.selApiRefs = refs
      const expanded = this.apiExpandAll
      const length = this.$refs[this.selApiRefs].store._getAllNodes().length
      for (let i = 0; i < length; i++) {
        this.$refs[this.selApiRefs].store._getAllNodes()[i].expanded = expanded
      }
    },
    apiCheckAllChangePid(node, data, refs = 'apiRef') {
      this.selApiRefs = refs
      this.apiCheckAllPid[data.api_id] = node.checked
      this.$refs[this.selApiRefs].setChecked(data.api_id, !this.apiCheckAllPid[data.api_id], true)
      data.children.forEach((item) => {
        this.$refs[this.selApiRefs].setChecked(item.api_id, !this.apiCheckAllPid[data.api_id], true)
      })
      this.apiCheckSetKeys()
    },
    apiCheckSetKeys() {
      if (this.selApiRefs === 'apiRef') {
        this.model.api_ids = this.$refs[this.selApiRefs].getCheckedKeys()
      } else {
        this.api_ids = this.$refs[this.selApiRefs].getCheckedKeys()
      }
    },
    // 分组会员显示
    memberShow(row) {
      this.memberDialog = true
      this.memberDialogTitle = '分组会员：' + row.group_name
      this.memberQuery.group_id = row.group_id
      this.memberQuery.search_value = ''
      this.member()
    },
    // 分组会员列表
    member() {
      this.memberLoad = true
      memberList(this.memberQuery)
        .then((res) => {
          this.memberData = res.data.list
          this.memberCount = res.data.count
          this.memberLoad = false
        })
        .catch(() => {
          this.memberLoad = false
        })
    },
    // 分组会员排序
    memberSort(sort) {
      this.memberQuery.sort_field = sort.prop
      this.memberQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.memberQuery.sort_value = 'asc'
        this.member()
      }
      if (sort.order === 'descending') {
        this.memberQuery.sort_value = 'desc'
        this.member()
      }
    },
    // 分组会员操作
    memberSelect(selection) {
      this.memberSelection = selection
      this.memberSelectIds = this.memberSelectGetIds(selection).toString()
    },
    memberSelectGetIds(selection) {
      return arrayColumn(selection, this.memberPk)
    },
    memberSelectAlert() {
      ElMessageBox.alert('请选择需要操作的' + this.memberName, '提示', {
        type: 'warning',
        callback: () => {}
      })
    },
    memberSelectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['memberRef'].clearSelection()
        this.$refs['memberRef'].toggleRowSelection(selectRow)
      }
      if (!this.memberSelection.length) {
        this.memberSelectAlert()
      } else {
        this.memberSelectTitle = '操作'
        if (selectType === 'memberRemove') {
          this.memberSelectTitle = '解除分组'
        }
        this.memberSelectDialog = true
        this.memberSelectType = selectType
      }
    },
    memberSelectCancel() {
      this.memberSelectDialog = false
    },
    memberSelectSubmit() {
      if (!this.memberSelection.length) {
        this.memberSelectAlert()
      } else {
        const selectType = this.memberSelectType
        if (selectType === 'memberRemove') {
          this.memberRemove(this.memberSelection)
        }
        this.memberSelectDialog = false
      }
    },
    // 分组会员解除
    memberRemove(row) {
      if (!row.length) {
        this.memberSelectAlert()
      } else {
        this.memberLoad = true
        memberRemove({
          group_id: this.memberQuery.group_id,
          member_ids: this.memberSelectGetIds(row)
        })
          .then((res) => {
            this.member()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.memberLoad = false
          })
      }
    }
  }
}
</script>
