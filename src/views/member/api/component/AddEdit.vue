<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('上级')" prop="api_pid">
                <el-cascader
                  v-model="model.api_pid"
                  :options="basedata.trees"
                  :props="basedata.props"
                  clearable
                  filterablec
                  lass="w-full"
                />
              </el-form-item>
              <el-form-item :label="$t('名称')" prop="api_name">
                <el-input v-model="model.api_name" clearable>
                  <template #append>
                    <Clipboard :content="model.api_name" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('链接')" prop="api_url">
                <el-input v-model="model.api_url" clearable>
                  <template #append>
                    <Clipboard :content="model.api_url" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('免登')" prop="is_unlogin">
                <ElSwitchWhether v-model="model.is_unlogin" />
              </el-form-item>
              <el-form-item :label="$t('免权')" prop="is_unauth">
                <ElSwitchWhether v-model="model.is_unauth" />
              </el-form-item>
              <el-form-item :label="$t('免限')" prop="is_unrate">
                <ElSwitchWhether v-model="model.is_unrate" />
              </el-form-item>
              <el-form-item :label="$t('日志类型')" prop="log_type">
                <el-radio-group v-model="model.log_type">
                  <el-radio v-for="v in basedata.log_types" :key="v.value" :value="v.value" :label="v.label" />
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('备注')" prop="remark">
                <el-input v-model="model.remark" clearable />
              </el-form-item>
              <el-form-item :label="$t('排序')" prop="sort">
                <el-input v-model="model.sort" type="number" placeholder="250" clearable />
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
    </el-tabs>
    <el-form-item>
      <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
        <el-button :loading="loading" @click="reset">{{ resetText }}</el-button>
        <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
        <el-button
          v-if="id && type === 'edit' && hasPerm(['admin/member.Api/add'])"
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
import { infoApi, addApi, editApi } from '@/api/member/api'

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
    },
    pid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      name: '',
      height: 750,
      loading: false,
      idkey: 'api_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        api_id: '',
        api_pid: 0,
        api_name: '',
        api_url: '',
        is_unlogin: 0,
        is_unauth: 0,
        is_unrate: 0,
        log_type: 2,
        remark: '',
        sort: 250,
        is_disable: 0,
        create_time: '',
        update_time: '',
        delete_time: ''
      },
      rules: {},
      basedata: {
        trees: [],
        props: { value: 'api_id', label: 'api_name', checkStrictly: true, emitPath: false },
        log_types: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('会员接口')
      this.height = screenHeight()
      this.rules = { api_name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }] }
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
        this.basedata.trees = data.basedata.trees
        this.basedata.log_types = data.basedata.log_types
        delete data.basedata
        if (data[this.idkey]) {
          this.model = data
        } else {
          this.model = this.$options.data().model
        }
      } else {
        this.model = this.$options.data().model
      }
      if (this.pid) {
        this.model.api_pid = Number(this.pid)
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
