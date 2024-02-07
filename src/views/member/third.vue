<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="member_id" label="会员ID" />
          <el-option value="nickname" label="昵称" />
          <el-option value="platform" label="平台" />
          <el-option value="application" label="应用" />
          <el-option value="remark" label="备注" />
          <el-option value="is_disable" label="禁用" />
          <el-option value="unionid" label="unionid" />
          <el-option value="openid" label="openid" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-select
          v-if="query.search_field === 'is_disable'"
          v-model="query.search_value"
          class="ya-search-value"
        >
          <el-option :value="1" label="是" />
          <el-option :value="0" label="否" />
        </el-select>
        <el-select
          v-else-if="query.search_field === 'platform'"
          v-model="query.search_value"
          class="ya-search-value"
        >
          <el-option
            v-for="platform in platforms"
            :key="platform.value"
            :value="platform.value"
            :label="platform.label"
          />
        </el-select>
        <el-select
          v-else-if="query.search_field === 'application'"
          v-model="query.search_value"
          class="ya-search-value"
        >
          <el-option
            v-for="application in applications"
            :key="application.value"
            :value="application.value"
            :label="application.label"
          />
        </el-select>
        <el-input
          v-else
          v-model="query.search_value"
          class="ya-search-value"
          placeholder="查询内容"
          clearable
        />
        <el-select v-model="query.date_field" class="ya-date-field" placeholder="时间类型">
          <el-option value="create_time" label="添加时间" />
          <el-option value="update_time" label="修改时间" />
          <el-option value="login_time" label="登录时间" />
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
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button title="重置" @click="refresh()">
          <svg-icon icon-class="refresh" />
        </el-button>
        <el-button type="primary" @click="add()">添加</el-button>
      </el-col>
    </el-row>
    <!-- 操作 -->
    <el-row>
      <el-col>
        <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
        <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-model="selectDialog"
      :title="selectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
    >
      <el-form ref="selectRef" label-width="120px">
        <el-form-item v-if="selectType === 'disable'" label="是否禁用">
          <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'dele'">
          <span class="c-red">确定要删除选中的{{ name }}吗？</span>
        </el-form-item>
        <el-form-item :label="name + 'ID'">
          <el-input v-model="selectIds" type="textarea" autosize disabled />
        </el-form-item>
      </el-form>
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
      <el-table-column prop="member_id" label="会员ID" width="100" sortable="custom" />
      <el-table-column
        prop="member_nickname"
        label="会员昵称"
        min-width="135"
        show-overflow-tooltip
      />
      <el-table-column
        prop="member_username"
        label="会员用户名"
        min-width="135"
        show-overflow-tooltip
      />
      <el-table-column prop="headimgurl" label="头像" min-width="62">
        <template #default="scope">
          <FileImage :file-url="scope.row.headimgurl" avatar lazy />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" min-width="135" show-overflow-tooltip />
      <el-table-column prop="platform_name" label="平台" min-width="80" show-overflow-tooltip />
      <el-table-column prop="application_name" label="应用" min-width="120" show-overflow-tooltip />
      <el-table-column prop="is_disable" label="禁用" min-width="85" sortable="custom">
        <template #default="scope">
          <el-switch
            v-model="scope.row.is_disable"
            :active-value="1"
            :inactive-value="0"
            @change="disable([scope.row])"
          />
        </template>
      </el-table-column>
      <el-table-column prop="login_time" label="登录时间" width="165" />
      <el-table-column prop="create_time" label="添加/绑定时间" min-width="165" />
      <el-table-column prop="update_time" label="修改时间" min-width="165" />
      <el-table-column label="操作" width="95">
        <template #default="scope">
          <el-link type="primary" class="mr-1" :underline="false" @click="edit(scope.row)">
            修改
          </el-link>
          <el-link
            type="primary"
            title="解绑"
            :underline="false"
            @click="selectOpen('dele', [scope.row])"
          >
            删除
          </el-link>
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
    >
      <el-scrollbar native :height="height - 30">
        <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
          <el-form-item label="会员ID" prop="member_id">
            <el-input
              v-model="model.member_id"
              type="number"
              placeholder="请输入会员ID"
              clearable
            />
          </el-form-item>
          <el-form-item label="平台" prop="platform">
            <el-select v-model="model.platform">
              <el-option
                v-for="platform in platforms"
                :key="platform.value"
                :value="platform.value"
                :label="platform.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应用" prop="application">
            <el-select v-model="model.application">
              <el-option
                v-for="application in applications"
                :key="application.value"
                :value="application.value"
                :label="application.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="unionid" prop="unionid">
            <el-input v-model="model.unionid" placeholder="请输入unionid" clearable />
          </el-form-item>
          <el-form-item label="openid" prop="openid">
            <el-input v-model="model.openid" placeholder="请输入openid" clearable />
          </el-form-item>
          <el-form-item label="头像" prop="headimgurl">
            <el-input v-model="model.headimgurl" placeholder="请输入头像链接或上传头像" clearable />
          </el-form-item>
          <el-form-item prop="headimgurl">
            <FileImage
              v-model:file-url="model.headimgurl"
              file-title="上传头像"
              :height="100"
              avatar
              upload
            />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="model.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="model.remark" placeholder="请输入备注" clearable />
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="登录IP" prop="login_ip">
            <el-input v-model="model.login_ip" disabled />
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="登录地区" prop="login_region">
            <el-input v-model="model.login_region" disabled />
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="登录时间" prop="login_time">
            <el-input v-model="model.login_time" disabled />
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="登录次数" prop="login_num">
            <el-input v-model="model.login_num" disabled />
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="添加/绑定时间" prop="create_time">
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
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import { arrayColumn } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import { list, info, add, edit, dele, disable } from '@/api/member/third'

export default {
  name: 'MemberThird',
  components: { Pagination },
  data() {
    return {
      name: '会员第三方账号',
      height: 680,
      loading: false,
      idkey: 'third_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'nickname',
        search_exp: 'like',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      platforms: [],
      applications: [],
      dialog: false,
      dialogTitle: '',
      model: {
        third_id: '',
        member_id: 0,
        platform: 20,
        application: 21,
        unionid: '',
        openid: '',
        headimgurl: '',
        nickname: '',
        remark: ''
      },
      rules: {
        member_id: [{ required: true, message: '请输入openid', trigger: 'blur' }],
        openid: [{ required: true, message: '请输入openid', trigger: 'blur' }]
      },
      selection: [],
      selectIds: '',
      selectTitle: '操作',
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
      list(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.exps = res.data.exps
          this.platforms = res.data.platforms
          this.applications = res.data.applications
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
        if (selectType === 'disable') {
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
    }
  }
}
</script>
