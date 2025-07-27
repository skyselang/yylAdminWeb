<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item v-if="model.file_id" :label="$t('文件')" prop="file_id">
                <FilePreview :file="model" :height="150" download />
              </el-form-item>
              <el-form-item :label="$t('文件编号')" prop="unique">
                <el-input v-model="model.unique" clearable />
              </el-form-item>
              <el-form-item
                :label="$t('文件名称')"
                :rules="{
                  required: model.add_type === 'add' ? false : true,
                  message: $t('请输入文件名称'),
                  trigger: 'blur'
                }"
                prop="file_name"
              >
                <el-input v-model="model.file_name" clearable>
                  <template #append>
                    <Clipboard :content="model.file_name" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('文件分组')" prop="group_id">
                <el-select v-model="model.group_id" clearable>
                  <el-option v-for="v in basedata.groups" :key="v.group_id" :value="v.group_id" :label="v.group_name" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('文件标签')" prop="tag_ids">
                <el-select v-model="model.tag_ids" clearable filterable multiple>
                  <el-option v-for="v in basedata.tags" :key="v.tag_id" :value="v.tag_id" :label="v.tag_name" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('文件类型')" prop="file_type">
                <el-select v-model="model.file_type">
                  <el-option v-for="v in basedata.file_types" :key="v.value" :value="v.value" :label="v.label" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="model.file_id" :label="$t('文件域名')" prop="domain">
                <el-input v-model="model.domain" clearable>
                  <template #append>
                    <Clipboard :content="model.domain" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="model.file_id" :label="$t('文件路径')" prop="file_path">
                <el-input v-model="model.file_path" :disabled="model.file_id ? true : false">
                  <template #append>
                    <Clipboard :content="model.file_path" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('文件链接')" prop="file_url">
                <el-input v-model="model.file_url" :disabled="model.file_id ? true : false" clearable>
                  <template #append>
                    <Clipboard :content="model.file_url" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="model.file_id" :label="$t('存储方式')" prop="storage">
                <el-select v-model="model.storage" :disabled="model.file_id ? true : false">
                  <el-option v-for="v in basedata.storages" :key="v.value" :value="v.value" :label="v.label" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('备注')" prop="remark">
                <el-input v-model="model.remark" clearable />
              </el-form-item>
              <el-form-item :label="$t('排序')" prop="sort">
                <el-input v-model="model.sort" type="number" clearable />
              </el-form-item>
              <el-form-item v-if="model.file_id" :label="$t('是否禁用')" prop="is_disable">
                <el-switch v-model="model.is_disable" :active-value="1" :inactive-value="0" disabled />
              </el-form-item>
              <el-form-item v-if="model.file_id" :label="$t('文件大小')" prop="file_size">
                <el-input v-model="model.file_size" disabled />
              </el-form-item>
              <el-form-item v-if="model.file_id" :label="$t('文件后缀')" prop="file_ext">
                <el-input v-model="model.file_ext" disabled />
              </el-form-item>
              <el-form-item v-if="model.file_id" :label="$t('文件MD5')" prop="file_md5">
                <el-input v-model="model.file_md5" disabled>
                  <template #append>
                    <Clipboard :content="model.file_md5" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="model.file_id" :label="$t('文件散列')" prop="file_hash">
                <el-input v-model="model.file_hash" disabled>
                  <template #append>
                    <Clipboard :content="model.file_hash" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="model.file_id" :label="$t('添加时间')" prop="create_time">
                <el-input v-model="model.create_time" disabled />
              </el-form-item>
              <el-form-item v-if="model.file_id" :label="$t('修改时间')" prop="update_time">
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
          v-if="id && type === 'edit' && hasPerm(['admin/file.File/add'])"
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
import { infoApi, addApi, editApi } from '@/api/file/file'

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
      idkey: 'file_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        add_type: 'add',
        file_id: '',
        unique: '',
        group_id: '',
        tag_ids: [],
        storage: 'local',
        domain: '',
        file_md5: '',
        file_hash: '',
        file_name: '',
        file_type: '',
        file_path: '',
        file_size: '',
        file_ext: '',
        file_url: '',
        remark: '',
        sort: 250,
        is_front: 0,
        is_disable: 0,
        is_delete: 0,
        remark: '',
        sort: 250,
        is_disable: 0,
        create_time: '',
        update_time: '',
        delete_time: ''
      },
      rules: {},
      basedata: { file_types: [], storages: [], setting: {}, groups: [], tags: [] }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('文件')
      this.height = screenHeight()
      this.rules = {
        file_type: [{ required: true, message: this.$t('请选择文件类型'), trigger: 'blur' }],
        file_url: [{ required: true, message: this.$t('请输入文件链接'), trigger: 'blur' }]
      }
      if (this.dialog) {
        this.height = screenHeight() - 100
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
      addApi({}, 'get', 'add')
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
        this.basedata.file_types = data.basedata.file_types
        this.basedata.storages = data.basedata.storages
        this.basedata.setting = data.basedata.setting
        this.basedata.groups = data.basedata.groups
        this.basedata.tags = data.basedata.tags
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
          api(params, 'post', 'add')
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
