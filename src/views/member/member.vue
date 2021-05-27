<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="22">
          <el-input v-model="query.member_id" class="filter-item" style="width: 110px;" placeholder="会员ID" clearable />
          <el-input v-model="query.username" class="filter-item" style="width: 140px;" placeholder="账号" clearable />
          <el-input v-model="query.phone" class="filter-item" style="width: 150px;" placeholder="手机" clearable />
          <el-input v-model="query.email" class="filter-item" style="width: 250px;" placeholder="邮箱" clearable />
          <el-select v-model="query.date_type" class="filter-item" style="width:110px;" placeholder="日期类型" clearable>
            <el-option value="create_time" label="注册时间" />
            <el-option value="login_time" label="登录时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_range"
            type="daterange"
            class="filter-item"
            style="width: 240px;"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="2" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="data" :height="height" style="width: 100%" border @sort-change="sort">
      <el-table-column prop="member_id" label="会员ID" min-width="100" sortable="custom" fixed="left" />
      <el-table-column prop="avatar" label="头像" min-width="100" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.avatar"
            style="width: 35px; height: 35px; border-radius: 100% / 100%;"
            :src="scope.row.avatar"
            :preview-src-list="[scope.row.avatar]"
            title="点击查看大图"
          />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="账号" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="nickname" label="昵称" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="phone" label="手机" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="email" label="邮箱" min-width="220" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="create_time" label="注册时间" min-width="160" sortable="custom" />
      <el-table-column prop="login_time" label="登录时间" min-width="160" sortable="custom" />
      <el-table-column prop="remark" label="备注" min-width="110" show-overflow-tooltip />
      <el-table-column prop="sort" label="排序" width="80" sortable="custom" />
      <el-table-column prop="is_disable" label="禁用" min-width="80" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="210" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="pwd(row)">密码</el-button>
          <el-button size="mini" type="success" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="dele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" width="50%" :before-close="cancel">
      <el-form ref="ref" :model="model" :rules="rules" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item v-if="model.member_id" label="头像" prop="avatar">
          <el-avatar shape="circle" fit="contain" :size="100" :src="model.avatar" />
          <el-upload
            name="avatar_file"
            :show-file-list="false"
            :before-upload="uploadBefore"
            :action="uploadAction"
            :headers="uploadHeaders"
            :data="uploadData"
            :on-success="uploadSuccess"
            :on-error="uploadError"
          >
            <el-button size="mini">更换头像</el-button>
          </el-upload>
          <span>jpg、png图片，小于100KB，宽高1:1</span>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input key="username" v-model="model.username" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input key="nickname" v-model="model.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="model.member_id == ''" label="密码" prop="password">
          <el-input key="password" v-model="model.password" placeholder="请输入密码" clearable show-password />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="model.phone" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="model.email" clearable />
        </el-form-item>
        <el-form-item label="地区" prop="region_id">
          <el-cascader v-model="model.region_id" :options="regionTree" :props="regionProps" style="width:100%" @change="regionChange" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" />
        </el-form-item>
        <el-form-item v-if="model.member_id" label="登录时间" prop="login_time">
          <el-col :span="10">
            <el-input v-model="model.login_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">登录地区</el-col>
          <el-col :span="10">
            <el-input v-model="model.login_region" disabled />
          </el-col>
        </el-form-item>
        <el-form-item v-if="model.member_id" label="注册时间" prop="create_time">
          <el-col :span="10">
            <el-input v-model="model.create_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">修改时间</el-col>
          <el-col :span="10">
            <el-input v-model="model.update_time" disabled />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog :title="pwdDialogTitle" :visible.sync="pwdDialog" top="1vh" :before-close="pwdCancel">
      <el-form ref="refPwd" :rules="pwdRules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="账号">
          <el-input v-model="model.username" clearable disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="model.nickname" clearable disabled />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="model.password" placeholder="请输入新密码" clearable show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdCancel">取消</el-button>
        <el-button type="primary" @click="pwdSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { getAdminToken } from '@/utils/auth'
import { list as regionList } from '@/api/region'
import { list, info, add, edit, dele, pwd, disable } from '@/api/member'

export default {
  name: 'Member',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      data: [],
      count: 0,
      query: {
        page: 1,
        limit: 12
      },
      dialog: false,
      dialogTitle: '',
      model: {
        member_id: '',
        username: '',
        nickname: '',
        password: '',
        phone: '',
        email: '',
        region_id: '',
        avatar: '',
        remark: '',
        sort: 10000
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      regionTree: [],
      regionProps: {
        expandTrigger: 'click',
        checkStrictly: true,
        value: 'region_id',
        label: 'region_name'
      },
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/Member/avatar',
      uploadHeaders: { AdminToken: getAdminToken() },
      uploadData: { member_id: '' },
      pwdDialog: false,
      pwdDialogTitle: '',
      pwdRules: {
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
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
        this.data = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加
    add() {
      this.dialog = true
      this.dialogTitle = '会员添加'
      regionList({ type: 'tree' }).then(res => {
        this.regionTree = res.data
      })
      this.reset()
    },
    // 修改
    edit(row) {
      this.dialog = true
      this.dialogTitle = '会员修改：' + row.member_id
      info({
        member_id: row.member_id
      }).then(res => {
        this.model = res.data
      })
    },
    // 删除
    dele(row) {
      this.$confirm(
        '确定要删除会员 <span style="color:red">' + row.username + ' </span>吗？',
        '会员删除：' + row.member_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.loading = true
        dele({
          member_id: row.member_id
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 取消
    cancel() {
      this.reset()
      this.dialog = false
    },
    // 提交
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
      this.query.sort_type = ''
      if (sort.order === 'ascending') {
        this.query.sort_type = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_type = 'desc'
        this.list()
      }
    },
    // 地区选择
    regionChange(value) {
      if (value) {
        this.model.region_id = value[value.length - 1]
      }
    },
    // 更换头像
    uploadBefore() {
      this.uploadData.member_id = this.model.member_id
    },
    uploadSuccess(res) {
      if (res.code === 200) {
        this.model.avatar = res.data.avatar
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    uploadError() {
      this.$message.error('上传出错')
    },
    // 是否禁用
    disable(row) {
      this.loading = true
      disable(row).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
      })
    },
    // 重置密码
    pwd(row) {
      this.pwdDialog = true
      this.pwdDialogTitle = '会员重置密码：' + row.member_id
      this.model.member_id = row.member_id
      this.model.username = row.username
      this.model.nickname = row.nickname
      this.model.password = ''
    },
    pwdCancel() {
      this.pwdDialog = false
      this.reset()
    },
    pwdSubmit() {
      this.$refs['refPwd'].validate(valid => {
        if (valid) {
          this.loading = true
          pwd({
            member_id: this.model.member_id,
            password: this.model.password
          }).then(res => {
            this.list()
            this.pwdDialog = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
