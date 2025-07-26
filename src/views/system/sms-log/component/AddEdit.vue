<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('国际码')" prop="intcode">
                <el-input v-model="model.intcode" clearable />
              </el-form-item>
              <el-form-item :label="$t('手机')" prop="phone">
                <el-input v-model="model.phone" clearable />
              </el-form-item>
              <el-form-item :label="$t('模板ID')" prop="template">
                <el-input v-model="model.template" />
              </el-form-item>
              <el-form-item :label="$t('模板变量')" prop="data">
                <el-input v-model="model.data" type="textarea" autosize placeholder="json" />
              </el-form-item>
              <el-form-item :label="$t('内容')" prop="content">
                <el-input v-model="model.content" type="textarea" autosize />
              </el-form-item>
              <el-form-item :label="$t('错误')" prop="error">
                <el-input v-model="model.error" type="textarea" autosize />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('添加时间')" prop="create_time">
                <ElDatePickerDatetime v-model="model.create_time" class="w-full!" />
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
          v-if="id && type === 'edit' && hasPerm(['admin/system.SmsLog/add'])"
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
import { infoApi, addApi, editApi } from '@/api/system/sms-log'

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
        intcode: '',
        phone: '',
        template: '',
        data: '',
        content: '',
        error: '',
        create_time: '',
        update_time: '',
        delete_time: ''
      },
      rules: {},
      resetTitle: '',
      resetText: '',
      basedata: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('短信日志')
      this.height = screenHeight()
      this.rules = {
        phone: [{ required: true, message: this.$t('请输入手机号码'), trigger: 'blur' }]
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
        this.basedata = data.basedata
        delete data.basedata
        if (data[this.idkey]) {
          data.data = JSON.stringify(data.data)
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
