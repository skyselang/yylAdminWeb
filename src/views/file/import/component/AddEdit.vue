<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('类型')" prop="type_name">
                <el-input v-model="model.type_name" disabled />
              </el-form-item>
              <el-form-item :label="$t('文件')" prop="file_name">
                <el-input v-model="model.file_name" disabled />
              </el-form-item>
              <el-form-item :label="$t('大小')" prop="file_size_name">
                <el-input v-model="model.file_size_name" disabled />
              </el-form-item>
              <el-form-item :label="$t('状态')" prop="status_name">
                <el-input v-model="model.status_name" disabled />
              </el-form-item>
              <el-form-item :label="$t('耗时(秒)')" prop="time">
                <el-input v-model="model.time" disabled />
              </el-form-item>
              <el-form-item :label="$t('导入数')" prop="import_num">
                <el-input v-model="model.import_num" disabled />
              </el-form-item>
              <el-form-item :label="$t('成功数')" prop="success_num">
                <el-input v-model="model.success_num" disabled />
              </el-form-item>
              <el-form-item :label="$t('失败数')" prop="fail_num">
                <el-input v-model="model.fail_num" disabled />
              </el-form-item>
              <el-form-item :label="$t('备注')" prop="remark">
                <el-input v-model="model.remark" :placeholder="$t('请输入备注')" clearable />
              </el-form-item>
              <el-form-item :label="$t('添加用户')" prop="create_uname">
                <el-input v-model="model.create_uname" disabled />
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
          v-if="id && type === 'edit' && hasPerm(['admin/file.Import/add'])"
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
import { infoApi, addApi, editApi } from '@/api/file/import'

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
      idkey: 'import_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        import_id: '',
        type: 0,
        type_name: '',
        file_name: '',
        file_path: '',
        file_url: '',
        file_size: 0,
        file_size_name: '',
        status: 0,
        status_name: '',
        time: 0,
        import_num: 0,
        success_num: 0,
        fail_num: 0,
        remark: '',
        is_disable: 0,
        create_uname: '',
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
      this.name = this.$t('导入文件')
      this.height = screenHeight()
      this.rules = { file_name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }] }
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
