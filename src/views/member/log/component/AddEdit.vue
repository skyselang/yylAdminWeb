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
              <el-form-item :label="$t('会员ID')" prop="member_id">
                <el-input v-model="model.member_id" type="number" />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('会员昵称')" prop="nickname">
                <el-input v-model="model.nickname" />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('会员用户名')" prop="username">
                <el-input v-model="model.username" />
              </el-form-item>
              <el-form-item :label="$t('接口')" prop="api_id">
                <el-cascader
                  v-model="model.api_id"
                  :options="basedata.apis"
                  :props="basedata.apiProps"
                  clearable
                  filterable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('接口名称')" prop="api_name">
                <el-input v-model="model.api_name" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('接口链接')" prop="api_url">
                <el-input v-model="model.api_url" disabled />
              </el-form-item>
              <el-form-item :label="$t('请求链接')" prop="request_url">
                <el-input v-model="model.request_url" :placeholder="$t('不含域名')" />
              </el-form-item>
              <el-form-item :label="$t('请求方法')" prop="request_method">
                <el-select v-model="model.request_method">
                  <el-option v-for="(v, k) in basedata.methods" :key="k" :value="k" :label="v" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('请求IP')" prop="request_ip">
                <el-input v-model="model.request_ip" />
              </el-form-item>
              <el-form-item :label="$t('请求地区')" prop="request_region">
                <el-input v-model="model.request_region" />
              </el-form-item>
              <el-form-item :label="$t('请求ISP')" prop="request_isp">
                <el-input v-model="model.request_isp" />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('平台')" prop="platform">
                <el-select v-model="model.platform">
                  <el-option v-for="v in basedata.platforms" :key="v.value" :value="v.value" :label="v.label" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('应用')" prop="application">
                <el-select v-model="model.application">
                  <el-option v-for="v in basedata.applications" :key="v.value" :value="v.value" :label="v.label" />
                </el-select>
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
      <el-tab-pane :label="$t('请求参数')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('用户代理')" prop="user_agent">
                <el-input v-model="model.user_agent" type="textarea" />
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
          v-if="id"
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
import { infoApi, addApi, editApi } from '@/api/member/log'

export default {
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
        log_type: '',
        member_id: '',
        nickname: '',
        username: '',
        api_id: '',
        api_name: '',
        api_url: '',
        request_url: '',
        request_method: 'GET',
        request_ip: '',
        request_country: '',
        request_province: '',
        request_city: '',
        request_area: '',
        request_region: '',
        request_isp: '',
        request_param: '',
        response_code: 200,
        response_msg: '',
        user_agent: '',
        platform: '',
        application: '',
        is_disable: 0,
        create_time: datetime(),
        update_time: ''
      },
      rules: {},
      resetTitle: '',
      resetText: '',
      basedata: {
        log_types: [],
        methods: [],
        platforms: [],
        applications: [],
        apis: [],
        apiProps: { value: 'api_id', label: 'api_name', checkStrictly: true }
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('会员日志')
      this.height = screenHeight()
      this.rules = { member_id: { required: true, message: this.$t('请输入会员ID'), trigger: 'blur' } }
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
        this.basedata.log_types = data.basedata.log_types
        this.basedata.methods = data.basedata.methods
        this.basedata.platforms = data.basedata.platforms
        this.basedata.applications = data.basedata.applications
        this.basedata.apis = data.basedata.apis
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
