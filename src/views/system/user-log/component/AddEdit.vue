<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item v-if="id" :label="$t('类型')" prop="log_type">
                <el-select v-model="model.log_type" disabled>
                  <el-option v-for="v in basedata.log_types" :key="v.value" :value="v.value" :label="v.label" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('用户')" prop="user_id">
                <el-select-v2
                  v-model="model.user_id"
                  :options="basedata.users"
                  :props="{ value: 'user_id', label: 'nickname' }"
                  clearable
                  filterable
                >
                  <template #default="{ item }">
                    <span>[{{ item.user_id }}] {{ item.nickname }} ({{ item.username }})</span>
                  </template>
                </el-select-v2>
              </el-form-item>
              <el-form-item :label="$t('菜单')" prop="menu_id">
                <el-cascader
                  v-model="model.menu_id"
                  :options="basedata.menus"
                  :props="basedata.menuProps"
                  clearable
                  filterable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('菜单名称')" prop="menu_name">
                <el-input v-model="model.menu_name" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('菜单链接')" prop="menu_url">
                <el-input v-model="model.menu_url" disabled />
              </el-form-item>
              <el-form-item :label="$t('请求链接')" prop="request_url">
                <el-input v-model="model.request_url" :placeholder="$t('不含域名')" />
              </el-form-item>
              <el-form-item :label="$t('请求方法')" prop="request_method">
                <el-select v-model="model.request_method">
                  <el-option v-for="v in basedata.methods" :key="v.value" :value="v.value" :label="v.label" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('请求IP')" prop="request_ip">
                <el-input v-model="model.request_ip" />
              </el-form-item>
              <el-form-item :label="$t('请求ISP')" prop="request_isp">
                <el-input v-model="model.request_isp" />
              </el-form-item>
              <el-form-item :label="$t('请求地区')" prop="request_region">
                <el-input v-model="model.request_region" />
              </el-form-item>
              <el-form-item :label="$t('返回码')" prop="response_code">
                <el-input v-model="model.response_code" />
              </el-form-item>
              <el-form-item :label="$t('返回描述')" prop="response_msg">
                <el-input v-model="model.response_msg" type="textarea" />
              </el-form-item>
              <el-form-item :label="$t('禁用')" prop="is_disable">
                <ElSwitchWhether v-model="model.is_disable" />
              </el-form-item>
              <el-form-item :label="$t('添加时间')" prop="create_time">
                <ElDatePickerDatetime v-model="model.create_time" />
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
      <el-tab-pane :label="$t('请求参数')" lazy>
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('用户代理')" prop="user_agent">
                <el-input v-model="model.user_agent" type="textarea" placeholder="User-Agent" />
              </el-form-item>
              <el-form-item :label="$t('请求参数')" prop="request_param">
                <el-col v-if="id">
                  <Clipboard :content="model.request_param" />
                </el-col>
                <el-input v-model="model.request_param" type="textarea" placeholder="json" autosize />
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
          v-if="id && type === 'edit' && hasPerm(['admin/system.UserLog/add'])"
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
import { screenHeight, addEditSuccessAlert, datetime, hasPerm } from '@/utils/index'
import { infoApi, addApi, editApi } from '@/api/system/user-log'

export default {
  components: {},
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'edit'
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      height: 750,
      loading: false,
      idkey: 'log_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        log_id: '',
        log_type: 1,
        user_id: '',
        user_nickname: '',
        user_username: '',
        menu_id: '',
        menu_name: '',
        menu_url: '',
        request_url: '',
        request_method: 'GET',
        request_ip: '',
        request_region: '',
        request_isp: '',
        response_code: 200,
        response_msg: '',
        request_param: '',
        user_agent: '',
        is_disable: 0,
        create_time: datetime(),
        update_time: '',
        delete_time: ''
      },
      rules: {},
      resetTitle: '',
      resetText: '',
      basedata: {
        users: [],
        menus: [],
        menuProps: { value: 'menu_id', label: 'menu_name', checkStrictly: true, emitPath: false },
        log_types: [],
        methods: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('用户日志')
      this.height = screenHeight()
      this.rules = {
        user_id: { required: true, message: this.$t('请选择用户'), trigger: 'blur' },
        create_time: { required: true, message: this.$t('请选择添加时间'), trigger: 'blur' }
      }
      this.model.response_msg = this.$t('操作成功')
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
        this.basedata.log_types = data.basedata.log_types
        this.basedata.methods = data.basedata.methods
        this.basedata.users = data.basedata.users
        this.basedata.menus = data.basedata.menus
        delete data.basedata
        if (data[this.idkey]) {
          data.request_param = JSON.stringify(data.request_param)
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
          api(this.model)
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
    }
  }
}
</script>
