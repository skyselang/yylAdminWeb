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
                <el-input v-model="model.unique" :placeholder="$t('请输入编号（工号）')" clearable />
              </el-form-item>
              <el-form-item :label="$t('昵称')" prop="nickname">
                <el-input v-model="model.nickname" :placeholder="$t('请输入昵称（姓名）')" clearable />
              </el-form-item>
              <el-form-item :label="$t('账号')" prop="username">
                <el-input v-model="model.username" :placeholder="$t('请输入账号（用户名）')" clearable />
              </el-form-item>
              <el-form-item v-if="model[idkey] == ''" :label="$t('密码')" prop="password">
                <el-input v-model="model.password" :placeholder="$t('请输入密码')" clearable show-password />
              </el-form-item>
              <el-form-item :label="$t('手机')" prop="phone">
                <el-input v-model="model.phone" clearable />
              </el-form-item>
              <el-form-item :label="$t('邮箱')" prop="email">
                <el-input v-model="model.email" clearable />
              </el-form-item>
              <el-form-item :label="$t('性别')" prop="gender">
                <el-radio-group v-model="model.gender">
                  <el-radio v-for="v in basedata.genders" :key="v.value" :value="v.value" :label="v.label" />
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('生日')" prop="birthday">
                <el-date-picker v-model="model.birthday" type="date" clearable value-format="YYYY-MM-DD" />
              </el-form-item>
              <el-form-item :label="$t('备注')" prop="remark">
                <el-input v-model="model.remark" clearable />
              </el-form-item>
              <el-form-item :label="$t('排序')" prop="sort">
                <el-input v-model="model.sort" type="number" />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('禁用')" prop="is_disable">
                <ElSwitchWhether v-model="model.is_disable" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('添加时间')" prop="create_time">
                <el-input v-model="model.create_time" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('修改时间')" prop="update_time">
                <el-input v-model="model.update_time" disabled />
              </el-form-item>
              <el-form-item v-if="model.delete_time" :label="$t('删除时间')" prop="delete_time">
                <el-input v-model="model.delete_time" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane :label="$t('权限信息')" lazy>
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('部门')" prop="dept_ids">
                <el-cascader
                  v-model="model.dept_ids"
                  :options="basedata.depts"
                  :props="basedata.deptProps"
                  clearable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item :label="$t('职位')" prop="post_ids">
                <el-cascader
                  v-model="model.post_ids"
                  :options="basedata.posts"
                  :props="basedata.postProps"
                  clearable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('角色')" prop="role_ids">
                <el-select v-model="model.role_ids" disabled multiple class="w-full">
                  <el-option v-for="v in basedata.roles" :key="v.role_id" :value="v.role_id" :label="v.role_name" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="id" :label="$t('超管')" prop="is_super">
                <ElSwitchWhether v-model="model.is_super" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('菜单(权限)')" prop="menu_ids">
                <el-col>
                  <el-checkbox v-model="menuExpandAlled" :title="$t('展开/收起')" @change="menuExpandAll">
                    <el-text size="default">{{ $t('展开') }}</el-text>
                  </el-checkbox>
                </el-col>
                <el-tree-v2
                  ref="menuRef"
                  :data="model.role_menu"
                  :props="basedata.menuProps"
                  :default-checked-keys="model.menu_ids"
                  :height="500"
                  show-checkbox
                  class="w-full"
                >
                  <template #default="row">
                    <el-row class="w-full">
                      <el-col :span="14">
                        <el-text size="default">{{ row.data.menu_name }}</el-text>
                      </el-col>
                      <el-col :span="2">
                        <el-text v-if="row.data.is_check" type="info" size="small" :title="$t('已分配权限')">
                          {{ $t('已分配') }}
                        </el-text>
                      </el-col>
                      <el-col :span="2">
                        <el-text v-if="row.data.is_role" type="info" size="small" :title="$t('角色权限')">
                          {{ $t('角色') }}
                        </el-text>
                      </el-col>
                      <el-col :span="2">
                        <el-text v-if="row.data.menu_url" type="info" size="small" :title="row.data.menu_url">
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
      <el-tab-pane v-if="id" :label="$t('登录信息')" lazy>
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
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
              <el-form-item :label="$t('上次登录IP')" prop="last_login_ip">
                <el-input v-model="model.last_login_ip" disabled />
              </el-form-item>
              <el-form-item :label="$t('上次登录地区')" prop="last_login_region">
                <el-input v-model="model.last_login_region" disabled />
              </el-form-item>
              <el-form-item :label="$t('上次登录时间')" prop="last_login_time">
                <el-input v-model="model.last_login_time" disabled />
              </el-form-item>
              <el-form-item :label="$t('退出时间')" prop="logout_time">
                <el-input v-model="model.logout_time" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <el-form-item>
      <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
        <el-button :loading="loading" @click="reset">{{ resetText }}</el-button>
        <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
        <el-button
          v-if="id && type === 'edit' && hasPerm(['admin/system.User/add'])"
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
import { infoApi, addApi, editApi } from '@/api/system/user'

export default {
  components: {},
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
      idkey: 'user_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        user_id: '',
        avatar_id: 0,
        avatar_url: '',
        unique: '',
        name: '',
        phone: '',
        email: '',
        gender: 0,
        birthday: '',
        dept_ids: [],
        post_ids: [],
        role_ids: [],
        is_super: 0,
        login_ip: '',
        login_region: '',
        login_time: '',
        logout_time: '',
        last_login_ip: '',
        last_login_region: '',
        last_login_time: '',
        remark: '',
        sort: 250,
        is_disable: 0,
        create_time: '',
        update_time: '',
        delete_time: ''
      },
      rules: {},
      resetTitle: '',
      resetText: '',
      basedata: {
        depts: [],
        posts: [],
        roles: [],
        genders: [],
        menu_ids: [],
        deptProps: { value: 'dept_id', label: 'dept_name', checkStrictly: true, emitPath: false, multiple: true },
        postProps: { value: 'post_id', label: 'post_name', checkStrictly: true, emitPath: false, multiple: true },
        menuProps: { value: 'menu_id', label: 'menu_name', disabled: 'menu_id' }
      },
      menuExpandAlled: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('用户')
      this.height = screenHeight()
      this.rules = {
        nickname: [{ required: true, message: this.$t('请输入昵称'), trigger: 'blur' }],
        username: [{ required: true, message: this.$t('请输入账号'), trigger: 'blur' }]
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
      infoApi({ [this.idkey]: this.id })
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
        this.basedata.depts = data.basedata.depts
        this.basedata.posts = data.basedata.posts
        this.basedata.roles = data.basedata.roles
        this.basedata.menu_ids = data.basedata.menu_ids
        this.basedata.genders = data.basedata.genders
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
          delete params.menus
          delete params.menu_ids
          delete params.roles
          delete params.role_ids
          delete params.role_menu
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
    // 菜单（权限）
    menuExpandAll() {
      if (this.menuExpandAlled) {
        this.$refs.menuRef.setExpandedKeys(this.basedata.menu_ids)
      } else {
        this.$refs.menuRef.setExpandedKeys([])
      }
    }
  }
}
</script>
