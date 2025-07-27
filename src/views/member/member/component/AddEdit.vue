<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('头像')" prop="avatar_id">
                <FileImage
                  v-model="model.avatar_id"
                  :file-url="model.avatar_url"
                  :file-title="$t('上传头像')"
                  :file-tip="$t('图片小于 100 KB，jpg、png格式，100 x 100')"
                  :height="100"
                  avatar
                  upload
                />
              </el-form-item>
              <el-form-item :label="$t('编号')" prop="unique">
                <el-input v-model="model.unique" clearable />
              </el-form-item>
              <el-form-item :label="$t('昵称')" prop="nickname">
                <el-input key="nickname" v-model="model.nickname" clearable />
              </el-form-item>
              <el-form-item :label="$t('用户名')" prop="username">
                <el-input key="username" v-model="model.username" clearable />
              </el-form-item>
              <el-form-item v-if="!id" :label="$t('密码')" prop="password">
                <el-input key="password" v-model="model.password" clearable show-password />
              </el-form-item>
              <el-form-item :label="$t('手机')" prop="phone">
                <el-input v-model="model.phone" clearable />
              </el-form-item>
              <el-form-item :label="$t('邮箱')" prop="email">
                <el-input v-model="model.email" clearable />
              </el-form-item>
              <el-form-item :label="$t('姓名')" prop="name">
                <el-input v-model="model.name" clearable />
              </el-form-item>
              <el-form-item :label="$t('性别')" prop="gender">
                <el-radio-group v-model="model.gender">
                  <el-radio v-for="v in basedata.genders" :key="v.value" :value="v.value" :label="v.label" />
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('生日')" prop="birthday">
                <el-date-picker v-model="model.birthday" type="date" clearable value-format="YYYY-MM-DD" />
              </el-form-item>
              <el-form-item :label="$t('家乡')" prop="hometown_id">
                <el-cascader
                  v-model="model.hometown_id"
                  :options="basedata.regions"
                  :props="regionProps"
                  clearable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item :label="$t('所在地')" prop="region_id">
                <el-cascader
                  v-model="model.region_id"
                  :options="basedata.regions"
                  :props="regionProps"
                  clearable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item :label="$t('备注')" prop="remark">
                <el-input v-model="model.remark" clearable />
              </el-form-item>
              <el-form-item :label="$t('排序')" prop="sort">
                <el-input v-model="model.sort" type="number" placeholder="250" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane :label="$t('权限信息')" lazy>
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('标签')" prop="tag_ids">
                <el-select v-model="model.tag_ids" multiple filterable clearable>
                  <el-option v-for="v in basedata.tags" :key="v.tag_id" :value="v.tag_id" :label="v.tag_name" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('分组(角色)')" prop="group_ids">
                <el-select v-model="model.group_ids" multiple filterable clearable>
                  <el-option v-for="v in basedata.groups" :key="v.group_id" :value="v.group_id" :label="v.group_name" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="id" :label="$t('超会')" prop="is_super">
                <ElSwitchWhether v-model="model.is_super" />
                <el-text v-if="model.is_super" size="default">{{ $t('超级会员，拥有所有权限') }}</el-text>
              </el-form-item>
              <el-form-item v-if="id" :label="$t('接口(权限)')" prop="api_ids">
                <el-col>
                  <el-checkbox v-model="apiExpandAlled" :title="$t('展开/收起')" @change="apiExpandAll">
                    <el-text size="default">{{ $t('展开') }}</el-text>
                  </el-checkbox>
                </el-col>
                <el-tree-v2
                  ref="apiRef"
                  :data="model.api_list"
                  :props="basedata.apiProps"
                  :default-checked-keys="model.api_ids"
                  :height="500"
                  show-checkbox
                  class="w-full"
                >
                  <template #default="row">
                    <el-row class="w-full">
                      <el-col :span="14">
                        <el-text size="default">{{ row.data.api_name }}</el-text>
                      </el-col>
                      <el-col :span="2">
                        <el-text v-if="row.data.is_check" type="info" size="small" :title="$t('已分配权限')">
                          {{ $t('已分配') }}
                        </el-text>
                      </el-col>
                      <el-col :span="2">
                        <el-text v-if="row.data.is_group" type="info" size="small" :title="$t('分组权限')">
                          {{ $t('分组') }}
                        </el-text>
                      </el-col>
                      <el-col :span="2">
                        <el-text v-if="row.data.api_url" type="info" size="small" :title="row.data.api_url">
                          {{ $t('链接') }}
                        </el-text>
                      </el-col>
                      <el-col :span="2">
                        <el-text v-if="row.data.is_unlogin" type="info" size="small" :title="$t('无需登录')">
                          {{ $t('免登') }}
                        </el-text>
                      </el-col>
                      <el-col :span="2">
                        <el-text v-if="row.data.is_unauth" type="info" size="small" :title="$t('无需权限')">
                          {{ $t('免权') }}
                        </el-text>
                      </el-col>
                    </el-row>
                  </template>
                </el-tree-v2>
              </el-form-item>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane v-if="id" :label="$t('登录注册')" lazy>
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item v-if="id" :label="$t('禁用')" prop="is_disable">
                <ElSwitchWhether v-model="model.is_disable" disabled />
              </el-form-item>
              <el-form-item :label="$t('登录IP')" prop="login_ip">
                <el-input v-model="model.login_ip" disabled />
              </el-form-item>
              <el-form-item :label="$t('登录地区')" prop="login_region">
                <el-input v-model="model.login_region" disabled />
              </el-form-item>
              <el-form-item :label="$t('登录时间')" prop="login_time">
                <el-input v-model="model.login_time" disabled />
              </el-form-item>
              <el-form-item :label="$t('登录次数')" prop="login_num">
                <el-input v-model="model.login_num" disabled />
              </el-form-item>
              <el-form-item :label="$t('注册平台')" prop="platform_name">
                <el-input v-model="model.platform_name" disabled />
              </el-form-item>
              <el-form-item :label="$t('注册应用')" prop="application_name">
                <el-input v-model="model.application_name" disabled />
              </el-form-item>
              <el-form-item :label="$t('注册时间')" prop="create_time">
                <el-input v-model="model.create_time" disabled />
              </el-form-item>
              <el-form-item :label="$t('修改时间')" prop="update_time">
                <el-input v-model="model.update_time" disabled />
              </el-form-item>
              <el-form-item :label="$t('退出时间')" prop="logout_time">
                <el-input v-model="model.logout_time" disabled />
              </el-form-item>
              <el-form-item v-if="model.delete_time" :label="$t('删除时间')" prop="delete_time">
                <el-input v-model="model.delete_time" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane v-if="id" :label="$t('第三方账号')" lazy>
        <el-scrollbar :height="height">
          <el-table :data="model.thirds" show-overflow-tooltip>
            <el-table-column prop="third_id" label="ID" width="80" />
            <el-table-column prop="headimgurl" :label="$t('头像')" min-width="68">
              <template #default="{ row }">
                <FileImage :file-url="row.headimgurl" avatar lazy />
              </template>
            </el-table-column>
            <el-table-column prop="nickname" :label="$t('昵称')" min-width="200" />
            <el-table-column prop="platform_name" :label="$t('平台')" min-width="82" />
            <el-table-column prop="application_name" :label="$t('应用')" min-width="110" />
            <el-table-column prop="is_disable_name" :label="$t('禁用')" min-width="85" />
            <el-table-column prop="create_time" :label="$t('添加/绑定时间')" min-width="165" />
            <el-table-column prop="login_time" :label="$t('登录时间')" width="165" />
          </el-table>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <el-form-item>
      <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
        <el-button :loading="loading" @click="reset">{{ resetText }}</el-button>
        <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
        <el-button
          v-if="id && type === 'edit' && hasPerm(['admin/member.Member/add'])"
          :loading="loading"
          :title="$t('修改将会变成添加')"
          class="float-right"
          @click="submit('add')"
        >
          {{ $t('添加') }}
        </el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight, addEditSuccessAlert, hasPerm } from '@/utils/index'
import { infoApi, addApi, editApi } from '@/api/member/member'

export default {
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    dialog: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'edit'
    }
  },
  data() {
    return {
      name: '',
      height: 750,
      loading: false,
      idkey: 'member_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        member_id: '',
        unique: '',
        avatar_id: 0,
        avatar_url: '',
        nickname: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        name: '',
        gender: 0,
        birthday: '',
        hometown_id: 0,
        region_id: '',
        is_super: 0,
        tag_ids: [],
        group_ids: [],
        thirds: [],
        remark: '',
        sort: 250,
        is_disable: 0,
        create_time: '',
        update_time: '',
        delete_time: ''
      },
      rules: {},
      basedata: {
        api_ids: [],
        tags: [],
        groups: [],
        regions: [],
        genders: [],
        platforms: [],
        applications: [],
        apiProps: { value: 'api_id', label: 'api_name', disabled: 'api_id' }
      },
      regionProps: { value: 'region_id', label: 'region_name', checkStrictly: true, emitPath: false },
      apiExpandAlled: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('会员')
      this.height = screenHeight()
      this.rules = {
        nickname: [{ required: true, message: this.$t('请输入昵称'), trigger: 'blur' }],
        username: [{ required: true, message: this.$t('请输入用户名'), trigger: 'blur' }]
      }
      if (this.dialog) {
        this.height = this.height - 100
        this.rowcol = { md: 23, lg: 23, xl: 23 }
        this.formclass = false
      }
      if (this.id) {
        this.resetText = this.$t('刷新')
        this.edit()
      } else {
        this.resetText = this.$t('清空')
        this.add()
      }
    },
    add() {
      addApi({}, 'get')
        .then((res) => {
          this.data(res.data)
        })
        .catch(() => {})
    },
    edit(ismsg = false) {
      let api = editApi
      if (this.type === 'info') {
        api = infoApi
      }
      api({ [this.idkey]: this.id }, 'get')
        .then((res) => {
          this.data(res.data)
          if (ismsg) {
            ElMessage.success(res.msg)
          }
        })
        .catch(() => {})
    },
    data(data) {
      if (data) {
        this.basedata.tags = data.basedata.tags
        this.basedata.groups = data.basedata.groups
        this.basedata.regions = data.basedata.regions
        this.basedata.api_ids = data.basedata.api_ids
        this.basedata.genders = data.basedata.genders
        this.basedata.platforms = data.basedata.platforms
        this.basedata.applications = data.basedata.applications
        delete data.basedata
        if (data[this.idkey]) {
          this.model = data
        } else {
          this.model = this.$options.data().model
        }
      } else {
        this.model = this.$options.data().model
      }
      this.$refs['ref'].resetFields()
      this.$refs['ref'].clearValidate()
    },
    reset() {
      this.loading = true
      if (this.id) {
        this.edit(true)
      } else {
        this.data()
      }
      this.loading = false
    },
    submit(type = '') {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          let api = addApi
          if (this.id) {
            if (type === 'add') {
              api = addApi
            } else {
              api = editApi
            }
          }
          let params = JSON.parse(JSON.stringify(this.model))
          delete params.api_ids
          delete params.api_urls
          delete params.api_list
          delete params.groups
          delete params.thirds
          api(params)
            .then((res) => {
              this.success(res, type)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    success(res, type = '') {
      this.loading = false
      ElMessage.success(res.msg)
      if (this.dialog) {
        this.$emit('close')
      } else {
        const id = type === 'add' ? '' : this.id
        addEditSuccessAlert(id, this.name, this.$route)
      }
    },
    apiExpandAll() {
      if (this.apiExpandAlled) {
        this.$refs.apiRef.setExpandedKeys(this.basedata.api_ids)
      } else {
        this.$refs.apiRef.setExpandedKeys([])
      }
    }
  }
}
</script>
