<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option :value="idkey" label="ID" />
            <el-option value="nickname" label="昵称" />
            <el-option value="username" label="用户名" />
            <el-option value="phone" label="手机" />
            <el-option value="email" label="邮箱" />
            <el-option value="tag_ids" label="标签" />
            <el-option value="group_ids" label="分组" />
            <el-option value="is_super" label="超会" />
            <el-option value="is_disable" label="禁用" />
            <el-option value="remark" label="备注" />
            <el-option value="name" label="姓名" />
            <el-option value="gender" label="性别" />
            <el-option value="region_id" label="所在地" />
            <el-option value="reg_channel" label="注册渠道" />
            <el-option value="reg_type" label="注册方式" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-select v-if="query.search_field==='tag_ids'" v-model="query.search_value" class="filter-item ya-search-value" clearable filterable multiple collapse-tags>
            <el-option v-for="item in tagData" :key="item.tag_id" :label="item.tag_name" :value="item.tag_id" />
          </el-select>
          <el-select v-else-if="query.search_field==='group_ids'" v-model="query.search_value" class="filter-item ya-search-value" clearable filterable multiple collapse-tags>
            <el-option v-for="item in groupData" :key="item.group_id" :label="item.group_name" :value="item.group_id" />
          </el-select>
          <el-select v-else-if="query.search_field==='is_super'||query.search_field==='is_disable'" v-model="query.search_value" class="filter-item ya-search-value" clearable>
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-select v-else-if="query.search_field==='reg_channel'" v-model="query.search_value" class="filter-item ya-search-value" clearable>
            <el-option v-for="(item,index) in reg_channels" :key="index" :label="item" :value="index" />
          </el-select>
          <el-cascader v-else-if="query.search_field==='region_id'" v-model="query.search_value" class="filter-item ya-search-value" :options="regionData" :props="regionQueryProps" clearable filterable collapse-tags />
          <el-select v-else-if="query.search_field==='reg_type'" v-model="query.search_value" class="filter-item ya-search-value" clearable>
            <el-option v-for="(item,index) in reg_types" :key="index" :label="item" :value="index" />
          </el-select>
          <el-select v-else-if="query.search_field==='gender'" v-model="query.search_value" class="filter-item ya-search-value" clearable>
            <el-option v-for="(item,index) in genders" :key="index" :label="item" :value="index" />
          </el-select>
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="查询内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间字段">
            <el-option value="create_time" label="注册时间" />
            <el-option value="login_time" label="登录时间" />
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
          <el-button title="修改所在地" @click="selectOpen('region')">所在地</el-button>
          <el-button title="修改标签" @click="selectOpen('edittag')">标签</el-button>
          <el-button title="修改分组" @click="selectOpen('editgroup')">分组</el-button>
          <el-button title="重置密码" @click="selectOpen('repwd')">密码</el-button>
          <el-button title="是否超会" @click="selectOpen('super')">超会</el-button>
          <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
          <el-button title="导出" style="float:right;" @click="selectOpen('export')">导出</el-button>
          <el-tooltip effect="dark" content="表头：昵称，用户名，手机，邮箱，密码" placement="left">
            <excel-import v-if="checkPermission(['admin/member.Member/export'])" :limit-size="1" title="导入" @on-import="imports" />
          </el-tooltip>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 4, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='region'" label="所在地" prop="">
            <el-cascader v-model="region_id" :options="regionData" :props="regionProps" class="ya-width-100p" clearable filterable />
          </el-form-item>
          <el-form-item v-else-if="selectType==='edittag'" label="标签" prop="">
            <el-select v-model="tag_ids" class="ya-width-100p" clearable filterable multiple>
              <el-option v-for="item in tagData" :key="item.tag_id" :label="item.tag_name" :value="item.tag_id" />
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="selectType==='editgroup'" label="分组" prop="">
            <el-select v-model="group_ids" class="ya-width-100p" clearable filterable multiple>
              <el-option v-for="item in groupData" :key="item.group_id" :label="item.group_name" :value="item.group_id" />
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="selectType==='super'" label="是否超会" prop="">
            <el-switch v-model="is_super" :active-value="1" :inactive-value="0" />
            <span> 超级会员，拥有所有权限。</span>
          </el-form-item>
          <el-form-item v-else-if="selectType==='disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
            <span v-if="is_disable" style="color:red"> 禁用后无法登录！</span>
          </el-form-item>
          <el-form-item v-else-if="selectType==='repwd'" label="新密码" prop="">
            <el-input v-model="password" placeholder="请输入新密码" clearable show-password />
          </el-form-item>
          <el-form-item v-else-if="selectType==='dele'" label="" prop="">
            <span style="color:red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
          <div v-else-if="selectType==='export'">
            <el-form-item label="文件名称" prop="">
              <el-input v-model="exportFileName" placeholder="请输入文件名称" clearable />
            </el-form-item>
            <el-form-item label="文件类型" prop="">
              <el-select v-model="exportBookType">
                <el-option v-for="item in ['xlsx','csv', 'txt']" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="自动宽度" prop="">
              <el-switch v-model="exportAutoWidth" :active-value="true" :inactive-value="false" />
              <span> 宽度是否自适应</span>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="loading" @click="selectCancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" @sort-change="sort" @selection-change="select" @cell-dblclick="cellDbclick">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="avatar_id" label="头像" min-width="50">
        <template slot-scope="scope">
          <div style="height:25px">
            <el-image style="width:25px;height:25px;border-radius:50%;" :src="scope.row.avatar_url" :preview-src-list="[scope.row.avatar_url]" fit="contain" title="点击看大图" lazy scroll-container=".el-table__body-wrapper">
              <div slot="error" class="image-slot">
                <el-avatar :size="25" icon="el-icon-user-solid" />
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" min-width="170" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="username" label="用户名" min-width="170" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="phone" label="手机" min-width="112" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="email" label="邮箱" min-width="200" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="tag_names" label="标签" min-width="130" show-overflow-tooltip />
      <el-table-column prop="group_names" label="分组" min-width="135" show-overflow-tooltip />
      <el-table-column prop="is_super" label="超会" min-width="75" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_super" :active-value="1" :inactive-value="0" @change="issuper([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="75" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="75" sortable="custom" />
      <el-table-column prop="create_time" label="注册时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count>0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="头像" prop="avatar_url">
          <el-col :span="12" style="height:100px">
            <el-image style="width:100px;height:100px;border-radius:50%;" :src="model.avatar_url" :preview-src-list="[model.avatar_url]" fit="contain" title="点击看大图">
              <div slot="error" class="image-slot">
                <el-avatar :size="100" icon="el-icon-user-solid" />
              </div>
            </el-image>
          </el-col>
          <el-col :span="12">
            <el-button size="mini" @click="fileUpload()">上传头像</el-button>
            <el-button size="mini" @click="fileDelete()">删除</el-button>
            <p>图片小于 200 KB，jpg、png格式。</p>
          </el-col>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="model.nickname" placeholder="请输入昵称" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.nickname, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input key="username" v-model="model.username" placeholder="请输入用户名" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.username, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="model.member_id==''" label="密码" prop="password">
          <el-input key="password" v-model="model.password" placeholder="请输入密码" clearable show-password />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="model.phone" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.phone, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="model.email" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.email, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="model.name" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.name, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="model.gender">
            <el-option v-for="(item,index) in genders" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tag_ids">
          <el-select v-model="model.tag_ids" class="ya-width-100p" multiple clearable filterable>
            <el-option v-for="item in tagData" :key="item.tag_id" :label="item.tag_name" :value="item.tag_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分组" prop="group_ids">
          <el-select v-model="model.group_ids" class="ya-width-100p" clearable filterable multiple>
            <el-option v-for="item in groupData" :key="item.group_id" :label="item.group_name" :value="item.group_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所在地" prop="region_id">
          <el-cascader v-model="model.region_id" class="ya-width-100p" :options="regionData" :props="regionProps" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" clearable />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="openid" prop="openid">
          <el-input v-model="model.openid" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="unionid" prop="unionid">
          <el-input v-model="model.unionid" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="注册时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
          <el-input v-model="model.delete_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="登录时间" prop="login_time">
          <el-input v-model="model.login_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="登录地区" prop="login_region">
          <el-input v-model="model.login_region" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="注册渠道" prop="reg_channel_name">
          <el-input v-model="model.reg_channel_name" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="注册方式" prop="reg_type_name">
          <el-input v-model="model.reg_type_name" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="接口(权限)" prop="api_ids">
          <span>
            <el-checkbox v-model="apiExpandAll" @change="apiExpandAllChange">展开</el-checkbox>
          </span>
          <el-tree ref="apiRef" :data="model.api_tree" :props="apiProps" :default-checked-keys="model.api_ids" :expand-on-click-node="true" :default-expand-all="false" :check-strictly="true" node-key="api_id" highlight-current>
            <span slot-scope="scope" class="custom-tree-node">
              <span>{{ scope.node.label }}<i v-if="scope.data.is_check" class="el-icon-check" style="color:#1890ff" title="已分配" /></span>
              <span>
                <i v-if="scope.data.api_url" class="el-icon-link" style="margin-left:10px" :title="scope.data.api_url" />
                <i v-else class="el-icon-link" style="margin-left:10px;color:#fff" />
                <i v-if="scope.data.is_group" class="el-icon-s-custom" style="margin-left:10px" title="分组" />
                <i v-else class="el-icon-s-custom" style="margin-left:10px;color:#fff" />
                <i v-if="scope.data.is_unauth" class="el-icon-unlock" style="margin-left:10px;" title="免权" />
                <i v-else class="el-icon-unlock" style="margin-left:10px;color:#fff" />
                <i v-if="scope.data.is_unlogin" class="el-icon-user" style="margin-left:10px;" title="免登" />
                <i v-else class="el-icon-user" style="margin-left:10px;color:#fff" />
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 文件管理 -->
    <el-dialog title="上传头像" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import FileManage from '@/components/FileManage'
import clip from '@/utils/clipboard'
import ExcelImport from '@/components/ExcelImport/index.vue'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, region, edittag, editgroup, repwd, issuper, disable, imports } from '@/api/member/member'

export default {
  name: 'Member',
  components: { Pagination, FileManage, ExcelImport },
  data() {
    return {
      name: '会员',
      height: 680,
      loading: false,
      idkey: 'member_id',
      exps: [],
      query: { page: 1, limit: 12, search_field: 'nickname', search_exp: 'like', date_field: 'create_time' },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        member_id: '',
        avatar_id: 0,
        avatar_url: '',
        tag_ids: [],
        group_ids: [],
        nickname: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        name: '',
        gender: 0,
        region_id: '',
        remark: '',
        sort: 250,
        api_ids: []
      },
      rules: {
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      genders: [],
      reg_channels: [],
      reg_types: [],
      regionData: [],
      regionProps: { checkStrictly: true, value: 'region_id', label: 'region_name', emitPath: false },
      regionQueryProps: { checkStrictly: true, value: 'region_id', label: 'region_name', multiple: true, emitPath: false },
      tagData: [],
      groupData: [],
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      region_id: 0,
      tag_ids: [],
      group_ids: [],
      password: '',
      is_super: 0,
      is_disable: 0,
      fileDialog: false,
      exportFileName: '',
      exportBookType: 'xlsx',
      exportAutoWidth: false,
      apiProps: { label: 'api_name', children: 'children' },
      apiCheckAll: false,
      apiExpandAll: false
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
  },
  methods: {
    checkPermission,
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.genders = res.data.genders
        this.reg_channels = res.data.reg_channels
        this.reg_types = res.data.reg_types
        this.regionData = res.data.region
        this.tagData = res.data.tag
        this.groupData = res.data.group
        this.exps = res.data.exps
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
        } else {
          this.$message.error('请完善必填项*')
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
      this.apiExpandAll = false
    },
    // 查询
    search() {
      this.query.page = 1
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
        if (selectType === 'region') {
          this.selectTitle = this.name + '修改所在地'
        } else if (selectType === 'edittag') {
          this.selectTitle = this.name + '修改标签'
        } else if (selectType === 'editgroup') {
          this.selectTitle = this.name + '修改分组'
        } else if (selectType === 'repwd') {
          this.selectTitle = this.name + '重置密码'
        } else if (selectType === 'super') {
          this.selectTitle = this.name + '是否超会'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
        } else if (selectType === 'dele') {
          this.selectTitle = this.name + '删除'
        } else if (selectType === 'export') {
          var date = new Date()
          var month = date.getMonth() + 1
          month = month < 10 ? '0' + month : month
          this.exportFileName = this.name + date.getFullYear() + '-' + month + '-' + date.getDate()
          this.selectTitle = this.name + '导出'
        } else if (selectType === 'import') {
          this.selectTitle = this.name + '导入'
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
        if (selectType === 'region') {
          this.region(this.selection)
        } else if (selectType === 'edittag') {
          this.edittag(this.selection)
        } else if (selectType === 'editgroup') {
          this.editgroup(this.selection)
        } else if (selectType === 'repwd') {
          this.repwd(this.selection)
        } else if (selectType === 'super') {
          this.issuper(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        } else if (selectType === 'export') {
          this.export(this.selection)
        } else if (selectType === 'import') {
          this.import(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 修改所在地
    region(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        region({
          ids: this.selectGetIds(row),
          region_id: this.region_id
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修改标签
    edittag(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        edittag({
          ids: this.selectGetIds(row),
          tag_ids: this.tag_ids
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修改分组
    editgroup(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editgroup({
          ids: this.selectGetIds(row),
          group_ids: this.group_ids
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 重置密码
    repwd(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        if (!this.password) {
          this.$message.error('请输入新密码')
        } else {
          this.loading = true
          repwd({
            ids: this.selectGetIds(row),
            password: this.password
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      }
    },
    // 是否超会
    issuper(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_super = row[0].is_super
        if (select) {
          is_super = this.is_super
        }
        issuper({
          ids: this.selectGetIds(row),
          is_super: is_super
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
    // 导入，results数据，header表头
    imports({ results, header }) {
      this.loading = true
      imports({
        import: results
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 导出
    export(row) {
      this.loading = true
      import('@/components/ExcelExport/index').then(excel => {
        const header = [
          { member_id: 'ID' },
          { nickname: '昵称' },
          { username: '用户名' },
          { phone: '手机' },
          { email: '邮箱' },
          { is_super: '超会' },
          { is_disable: '禁用' },
          { remark: '备注' },
          { create_time: '注册时间' }
        ]
        excel.excelExport(row, header, this.exportFileName, this.exportBookType, this.exportAutoWidth)
        this.loading = false
      })
    },
    // 权限展开
    apiExpandAllChange() {
      const expanded = this.apiExpandAll
      const length = this.$refs.apiRef.store._getAllNodes().length
      for (let i = 0; i < length; i++) {
        this.$refs.apiRef.store._getAllNodes()[i].expanded = expanded
      }
    },
    // 上传头像
    fileUpload() {
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(fileList) {
      this.fileDialog = false
      const fileLength = fileList.length
      if (fileLength) {
        const i = fileLength - 1
        this.model.avatar_id = fileList[i]['file_id']
        this.model.avatar_url = fileList[i]['file_url']
      }
    },
    fileDelete() {
      this.model.avatar_id = 0
      this.model.avatar_url = ''
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
