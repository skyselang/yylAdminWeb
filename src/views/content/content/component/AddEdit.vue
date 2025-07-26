<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('编号')" prop="unique">
                <el-input v-model="model.unique" clearable />
              </el-form-item>
              <el-form-item :label="$t('图片')" prop="image_id">
                <FileImage v-model="model.image_id" :file-url="model.image_url" :height="100" upload />
              </el-form-item>
              <el-form-item :label="$t('名称')" prop="name">
                <el-input v-model="model.name" clearable />
              </el-form-item>
              <el-form-item :label="$t('分类')" prop="category_ids">
                <el-cascader
                  v-model="model.category_ids"
                  :options="basedata.categorys"
                  :props="basedata.categoryProps"
                  clearable
                  filterable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item :label="$t('标签')" prop="tag_ids">
                <el-select v-model="model.tag_ids" multiple clearable filterable class="w-full">
                  <el-option v-for="v in basedata.tags" :key="v.tag_id" :label="v.tag_name" :value="v.tag_id" />
                </el-select>
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
              <el-form-item :label="$t('来源')" prop="source">
                <el-input v-model="model.source" clearable />
              </el-form-item>
              <el-form-item :label="$t('作者')" prop="author">
                <el-input v-model="model.author" clearable />
              </el-form-item>
              <el-form-item :label="$t('链接')" prop="url">
                <el-input v-model="model.url" clearable />
              </el-form-item>
              <el-form-item :label="$t('备注')" prop="remark">
                <el-input v-model="model.remark" clearable />
              </el-form-item>
              <el-form-item :label="$t('排序')" prop="sort">
                <el-input v-model="model.sort" clearable type="number" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane :label="$t('内容信息')" lazy>
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('内容')" prop="content">
                <RichEditor v-model="model.content" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane :label="$t('附件信息')" lazy>
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
              <el-form-item :label="$t('视频列表')" prop="videos">
                <FileUploads
                  v-model="model.videos"
                  :upload-btn="$t('上传视频')"
                  :file-tip="$t('视频文件')"
                  file-type="video"
                />
              </el-form-item>
              <el-form-item :label="$t('音频列表')" prop="audios">
                <FileUploads
                  v-model="model.audios"
                  :upload-btn="$t('上传音频')"
                  :file-tip="$t('音频文件')"
                  file-type="audio"
                />
              </el-form-item>
              <el-form-item :label="$t('文档列表')" prop="words">
                <FileUploads
                  v-model="model.words"
                  :upload-btn="$t('上传文档')"
                  :file-tip="$t('文档文件')"
                  file-type="word"
                />
              </el-form-item>
              <el-form-item :label="$t('其它列表')" prop="others">
                <FileUploads
                  v-model="model.others"
                  :upload-btn="$t('上传其它')"
                  :file-tip="$t('其它文件')"
                  file-type="other"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane :label="$t('其它信息')" lazy>
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('置顶')" prop="is_top">
                <ElSwitchWhether v-model="model.is_top" />
              </el-form-item>
              <el-form-item :label="$t('热门')" prop="is_hot">
                <ElSwitchWhether v-model="model.is_hot" />
              </el-form-item>
              <el-form-item :label="$t('推荐')" prop="is_rec">
                <ElSwitchWhether v-model="model.is_rec" />
              </el-form-item>
              <el-form-item :label="$t('发布时间')" prop="release_time">
                <ElDatePickerDatetime v-model="model.release_time" />
              </el-form-item>
              <el-form-item :label="$t('初始点击')" prop="hits_initial">
                <el-col :span="6">
                  <el-input v-model="model.hits_initial" ::placeholder="$t('初始点击量')" type="number" />
                </el-col>
                <el-col :span="3" class="text-center">{{ $t('真实点击') }}</el-col>
                <el-col :span="6">
                  <el-input v-model="model.hits" :placeholder="$t('真实点击量')" type="number" disabled />
                </el-col>
                <el-col :span="3" class="text-center">{{ $t('展示点击') }}</el-col>
                <el-col :span="6">
                  <el-input :value="parseFloat(model.hits_initial) + parseFloat(model.hits)" type="number" disabled />
                </el-col>
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
          v-if="id && type === 'edit' && hasPerm(['admin/content.Content/add'])"
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
import { infoApi, addApi, editApi } from '@/api/content/content'

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
      idkey: 'content_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        content_id: '',
        unique: '',
        image_id: 0,
        image_url: '',
        name: '',
        category_ids: [],
        tag_ids: [],
        title: '',
        keywords: '',
        description: '',
        content: '',
        source: '',
        author: '',
        url: '',
        is_top: 0,
        is_hot: 0,
        is_rec: 0,
        release_time: datetime(),
        hits: 0,
        hits_initial: 0,
        images: [],
        videos: [],
        audios: [],
        words: [],
        others: [],
        remark: '',
        sort: 250,
        is_disable: 0,
        create_time: '',
        update_time: '',
        delete_time: ''
      },
      rules: {},
      basedata: {
        categorys: [],
        categoryProps: {
          value: 'category_id',
          label: 'category_name',
          checkStrictly: true,
          emitPath: false,
          multiple: true
        },
        tags: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('内容')
      this.height = screenHeight()
      this.rules = { name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }] }
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
        this.basedata.categorys = data.basedata.categorys
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
    }
  }
}
</script>
