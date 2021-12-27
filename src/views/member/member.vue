<template>
  <div class="app-container">
    <!-- 查询、选中操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="username" label="账号" />
            <el-option value="nickname" label="昵称" />
            <el-option value="phone" label="手机" />
            <el-option value="email" label="邮箱" />
            <el-option value="remark" label="备注" />
            <el-option value="member_id" label="ID" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间字段">
            <el-option value="create_time" label="注册时间" />
            <el-option value="login_time" label="登录时间" />
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
          <el-button @click="selectOpen('region')">地区</el-button>
          <el-button @click="selectOpen('repwd')">密码</el-button>
          <el-button @click="selectOpen('disable')">禁用</el-button>
          <el-button @click="dele(selection)">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog title="选中操作" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item v-if="selectType==='region'" label="地区" prop="">
            <el-cascader
              v-model="region_id"
              :options="regionData"
              :props="regionProps"
              style="width:100%"
              placeholder="地区"
              clearable
              filterable
              @change="selectRegionChange"
            />
          </el-form-item>
          <el-form-item v-if="selectType==='disable'" label="禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-if="selectType==='repwd'" label="新密码" prop="">
            <el-input v-model="password" placeholder="请输入新密码" clearable show-password />
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
      <el-table-column prop="member_id" label="ID" min-width="100" sortable="custom" />
      <el-table-column prop="avatar_id" label="头像" min-width="80">
        <template slot-scope="scope">
          <el-image v-if="scope.row.avatar_url" class="ya-img-table" :src="scope.row.avatar_url" :preview-src-list="[scope.row.avatar_url]" title="点击查看大图" />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="账号" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="nickname" label="昵称" min-width="200" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="phone" label="手机" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="email" label="邮箱" min-width="220" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="110" show-overflow-tooltip />
      <el-table-column prop="is_disable" label="禁用" min-width="80" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" sortable="custom" />
      <el-table-column prop="create_time" label="注册时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="120" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="selectOpen('repwd',row)">密码</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :model="model" :rules="rules" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="头像" prop="avatar_url">
          <el-col :span="8">
            <el-image class="ya-img-form" :src="model.avatar_url" fit="contain" :preview-src-list="[model.avatar_url]" title="点击查看大图">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-col>
          <el-col :span="16">
            <el-button size="mini" @click="fileUpload()">上传头像</el-button>
            <el-button size="mini" @click="fileDelete('avatar')">删除</el-button>
            <br>
            <span>jpg、png图片，小于100kb，宽高1:1</span>
          </el-col>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input key="username" v-model="model.username" placeholder="请输入账号" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.username, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="model.nickname" placeholder="请输入昵称" clearable>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.nickname, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="model.member_id == ''" label="密码" prop="password">
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
        <el-form-item label="地区" prop="region_id">
          <el-cascader v-model="model.region_id" :options="regionData" :props="regionProps" style="width:100%" @change="regionChange" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" />
        </el-form-item>
        <el-form-item v-if="model.member_id" label="注册时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.member_id" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.member_id" label="登录时间" prop="login_time">
          <el-input v-model="model.login_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.member_id" label="登录地区" prop="login_region">
          <el-input v-model="model.login_region" disabled>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.wechat.login_region, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="model.member_id" label="微信信息" prop="wechat" />
        <el-form-item v-if="model.wechat" label="头像" prop="">
          <el-image
            v-if="model.wechat.headimgurl"
            class="ya-img-form"
            :src="model.wechat.headimgurl"
            :preview-src-list="[model.wechat.headimgurl]"
            title="点击查看大图"
          />
        </el-form-item>
        <el-form-item v-if="model.wechat" label="昵称" prop="">
          <el-input v-model="model.wechat.nickname" disabled>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.wechat.nickname, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="model.wechat" label="性别" prop="">
          <el-tag v-if="model.wechat.sex==0" type="info">未知</el-tag>
          <el-tag v-else-if="model.wechat.sex==1" type="info">男</el-tag>
          <el-tag v-else-if="model.wechat.sex==2" type="info">女</el-tag>
        </el-form-item>
        <el-form-item v-if="model.wechat" label="国家" prop="">
          <el-input v-model="model.wechat.country" disabled />
        </el-form-item>
        <el-form-item v-if="model.wechat" label="省份" prop="">
          <el-input v-model="model.wechat.province" disabled />
        </el-form-item>
        <el-form-item v-if="model.wechat" label="城市" prop="">
          <el-input v-model="model.wechat.city" disabled />
        </el-form-item>
        <el-form-item v-if="model.wechat" label="语言" prop="">
          <el-input v-model="model.wechat.language" disabled />
        </el-form-item>
        <el-form-item v-if="model.wechat" label="mwid" prop="">
          <el-input v-model="model.wechat.member_wechat_id" disabled />
        </el-form-item>
        <el-form-item v-if="model.wechat" label="openid" prop="">
          <el-input v-model="model.wechat.openid" disabled>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.wechat.openid, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="model.wechat" label="unionid" prop="">
          <el-input v-model="model.wechat.unionid" disabled>
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.wechat.unionid, $event)" />
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 文件管理 -->
    <el-dialog title="上传头像" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import FileManage from '@/components/FileManage'
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import { list as regionList } from '@/api/region'
import { list, info, add, edit, dele, region, repwd, disable } from '@/api/member'

export default {
  name: 'Member',
  components: { Pagination, FileManage },
  data() {
    return {
      name: '会员',
      height: 680,
      loading: false,
      data: [],
      count: 0,
      query: {
        page: 1,
        limit: 15,
        search_field: 'username',
        date_field: 'create_time'
      },
      dialog: false,
      dialogTitle: '',
      model: {
        member_id: '',
        avatar_id: 0,
        avatar_url: '',
        username: '',
        nickname: '',
        password: '',
        phone: '',
        email: '',
        region_id: '',
        remark: '',
        sort: 250,
        wechat: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      regionData: [],
      regionProps: { expandTrigger: 'click', checkStrictly: true, value: 'region_id', label: 'region_name' },
      selection: [],
      selectDialog: false,
      selectType: '',
      region_id: 0,
      is_disable: 0,
      password: '',
      fileDialog: false
    }
  },
  created() {
    this.height = screenHeight(280)
    this.list()
    this.regionList()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.selectButton = false
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加、修改
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.member_id
      info({
        member_id: row.member_id
      }).then(res => {
        this.model = res.data
      })
    },
    cancel() {
      this.reset()
      this.dialog = false
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.member_id) {
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
    // 上传头像
    fileUpload() {
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(filelist) {
      this.fileDialog = false
      if (filelist) {
        this.model.avatar_id = filelist[0]['file_id']
        this.model.avatar_url = filelist[0]['file_url']
      }
    },
    fileDelete(field = '') {
      if (field === 'avatar') {
        this.model.avatar_id = 0
        this.model.avatar_url = ''
      }
    },
    // 地区列表
    regionList() {
      regionList({ type: 'tree' }).then(res => {
        this.regionData = res.data
      })
    },
    // 地区选择
    regionChange(value) {
      if (value) {
        this.model.region_id = value[value.length - 1]
      }
    },
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 个' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].member_id
          message = '确定要删除' + this.name + ' <span style="color:red">' + row[0].username + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            ids: arrayColumn(row, 'member_id')
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
    },
    // 重置
    reset() {
      this.model = this.$options.data().model
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
        if (type === 'region') {
          this.region(this.selection, true)
        } else if (type === 'disable') {
          this.disable(this.selection, true)
        } else if (type === 'repwd') {
          this.repwd(this.selection, true)
        }
        this.selectDialog = false
      }
    },
    selectRegionChange(value) {
      if (value) {
        this.region_id = value[value.length - 1]
      }
    },
    // 设置地区
    region(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var region_id = row[0].region_id
        if (select) {
          region_id = this.region_id
        }
        region({
          ids: arrayColumn(row, 'member_id'),
          region_id: region_id
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
          ids: arrayColumn(row, 'member_id'),
          is_disable: is_disable
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
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
          return false
        }
        this.loading = true
        repwd({
          ids: arrayColumn(row, 'member_id'),
          password: this.password
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 复制
    copy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message.error('内容为空')
      }
    }
  }
}
</script>
