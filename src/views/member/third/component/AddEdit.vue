<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('会员ID')" prop="member_id">
                <el-input v-model="model.member_id" clearable type="number" />
              </el-form-item>
              <el-form-item :label="$t('应用')" prop="application">
                <el-select v-model="model.application">
                  <el-option v-for="v in basedata.applications" :key="v.value" :value="v.value" :label="v.label" />
                </el-select>
              </el-form-item>
              <el-form-item label="unionid" prop="unionid">
                <el-input v-model="model.unionid" clearable :placeholder="$t('unionid，openid 二选一')" />
              </el-form-item>
              <el-form-item label="openid" prop="openid">
                <el-input v-model="model.openid" clearable :placeholder="$t('unionid，openid 二选一')" />
              </el-form-item>
              <el-form-item :label="$t('头像')" prop="headimgurl">
                <el-input v-model="model.headimgurl" :placeholder="$t('请输入头像链接或上传头像')" clearable />
              </el-form-item>
              <el-form-item prop="headimgurl">
                <FileImage
                  v-model="model.avatar_id"
                  v-model:file-url="model.headimgurl"
                  :file-title="$t('上传头像')"
                  :height="100"
                  avatar
                  upload
                />
              </el-form-item>
              <el-form-item :label="$t('昵称')" prop="nickname">
                <el-input v-model="model.nickname" clearable />
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
              <el-form-item v-if="id" :label="$t('登录IP')" prop="login_ip">
                <el-input v-model="model.login_ip" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('登录地区')" prop="login_region">
                <el-input v-model="model.login_region" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('登录时间')" prop="login_time">
                <el-input v-model="model.login_time" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('登录次数')" prop="login_num">
                <el-input v-model="model.login_num" disabled />
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
          v-if="id && type === 'edit' && hasPerm(['admin/member.Third/add'])"
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
import { infoApi, addApi, editApi } from '@/api/member/third'

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
      idkey: 'third_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        third_id: '',
        member_id: '',
        application: 21,
        unionid: '',
        openid: '',
        avatar_id: 0,
        headimgurl: '',
        nickname: '',
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
      basedata: { platforms: [], applications: [] }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('会员第三方账号')
      this.height = screenHeight()
      this.rules = {
        member_id: [{ required: true, message: this.$t('请输入会员ID'), trigger: 'blur' }],
        application: [{ required: true, message: this.$t('请选择应用'), trigger: 'blur' }]
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
        this.basedata.platforms = data.basedata.platforms
        this.basedata.applications = data.basedata.applications
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
