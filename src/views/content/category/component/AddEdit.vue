<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('上级')" prop="category_pid">
                <el-cascader
                  v-model="model.category_pid"
                  :options="basedata.trees"
                  :props="basedata.props"
                  clearable
                  filterable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item :label="$t('编号')" prop="category_unique">
                <el-input v-model="model.category_unique" clearable />
              </el-form-item>
              <el-form-item :label="$t('名称')" prop="category_name">
                <el-input v-model="model.category_name" clearable />
              </el-form-item>
              <el-form-item :label="$t('图片')" prop="image_id">
                <FileImage v-model="model.image_id" :file-url="model.image_url" :height="100" upload />
              </el-form-item>
              <el-form-item :label="$t('标题')" prop="title">
                <el-input v-model="model.title" clearable />
              </el-form-item>
              <el-form-item :label="$t('关键词')" prop="keywords">
                <el-input v-model="model.keywords" clearable />
              </el-form-item>
              <el-form-item :label="$t('描述')" prop="description">
                <el-input v-model="model.description" type="textarea" />
              </el-form-item>
              <el-form-item :label="$t('备注')" prop="remark">
                <el-input v-model="model.remark" clearable />
              </el-form-item>
              <el-form-item :label="$t('排序')" prop="sort">
                <el-input v-model="model.sort" clearable />
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
      <el-tab-pane :label="$t('图片列表')" lazy>
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('图片列表')" prop="images">
                <FileUploads
                  v-model="model.images"
                  :upload-btn="$t('上传图片')"
                  :file-tip="$t('图片文件')"
                  file-type="image"
                />
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
          v-if="id && type === 'edit' && hasPerm(['admin/content.Category/add'])"
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
import { infoApi, addApi, editApi } from '@/api/content/category'

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
      idkey: 'category_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        category_id: '',
        category_pid: 0,
        category_unique: '',
        category_name: '',
        image_id: 0,
        image_url: '',
        title: '',
        keywords: '',
        description: '',
        images: [],
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
        trees: [],
        props: { value: 'category_id', label: 'category_name', checkStrictly: true, emitPath: false }
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('内容分类')
      this.height = screenHeight()
      this.rules = {
        category_name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }]
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
        this.basedata.trees = data.basedata.trees
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
        this.model.category_pid = Number(this.pid)
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
