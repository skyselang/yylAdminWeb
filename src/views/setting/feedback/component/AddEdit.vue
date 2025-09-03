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
              <el-form-item :label="$t('会员ID')" prop="member_id">
                <MemberSelector
                  v-model:member-id="model.member_id"
                  v-model:nickname="model.member_nickname"
                  v-model:username="model.member_username"
                />
              </el-form-item>
              <el-form-item :label="$t('类型')" prop="type">
                <el-select v-model="model.type">
                  <el-option v-for="v in basedata.types" :key="v.value" :value="v.value" :label="v.label" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('标题')" prop="title">
                <el-input v-model="model.title" clearable />
              </el-form-item>
              <el-form-item :label="$t('内容')" prop="content">
                <el-input v-model="model.content" type="textarea" />
              </el-form-item>
              <el-form-item :label="$t('图片')" prop="images">
                <FileUploads
                  v-model="model.images"
                  :upload-btn="$t('上传图片')"
                  :file-tip="$t('图片文件')"
                  file-type="image"
                />
              </el-form-item>
              <el-form-item :label="$t('手机')" prop="phone">
                <el-input v-model="model.phone" clearable />
              </el-form-item>
              <el-form-item :label="$t('邮箱')" prop="email">
                <el-input v-model="model.email" clearable />
              </el-form-item>
              <el-form-item :label="$t('回复')" prop="reply">
                <el-input v-model="model.reply" type="textarea" />
              </el-form-item>
              <el-form-item :label="$t('状态')" prop="status">
                <el-select v-model="model.status">
                  <el-option v-for="v in basedata.statuss" :key="v.value" :value="v.value" :label="v.label" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('排序')" prop="sort">
                <el-input v-model="model.sort" type="number" clearable />
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
          v-if="id && type === 'edit' && hasPerm(['admin/setting.Feedback/add'])"
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
import { infoApi, addApi, editApi } from '@/api/setting/feedback'
import MemberSelector from '@/views/member/member/component/Selector.vue'

export default {
  components: { MemberSelector },
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
      idkey: 'feedback_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        feedback_id: '',
        unique: '',
        member_id: 0,
        member_nickname: '',
        member_username: '',
        type: 0,
        title: '',
        content: '',
        images: [],
        phone: '',
        email: '',
        reply: '',
        status: 0,
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
      basedata: { types: [], statuss: [] }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('反馈')
      this.height = screenHeight()
      this.rules = {
        title: [{ required: true, message: this.$t('请输入标题'), trigger: 'blur' }],
        content: [{ required: true, message: this.$t('请输入内容'), trigger: 'blur' }]
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
        this.basedata.types = data.basedata.types
        this.basedata.statuss = data.basedata.statuss
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
